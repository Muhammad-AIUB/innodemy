import { useMemo, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import {
    useLessonByIdQuery,
    useUpdateLessonContentMutation,
} from "../hooks";
import type { LessonContentBlock } from "../types";

interface LocationState {
    courseId?: string;
}

type ParseContentResult =
    | { ok: true; blocks: LessonContentBlock[] }
    | { ok: false; message: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const hasExactKeys = (value: Record<string, unknown>, keys: string[]) =>
    Object.keys(value).length === keys.length &&
    keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const isValidUrl = (value: unknown): value is string => {
    if (!isNonEmptyString(value)) return false;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const parseLessonContent = (value: string): ParseContentResult => {
    let parsed: unknown;

    try {
        parsed = JSON.parse(value);
    } catch {
        return { ok: false, message: "Invalid JSON." };
    }

    if (!Array.isArray(parsed)) {
        return { ok: false, message: "Content must be a JSON array." };
    }

    const blocks: LessonContentBlock[] = [];

    for (let i = 0; i < parsed.length; i += 1) {
        const item = parsed[i];
        if (!isRecord(item) || !isNonEmptyString(item.type)) {
            return { ok: false, message: `Invalid block at index ${i}.` };
        }

        if (
            item.type === "text" &&
            hasExactKeys(item, ["type", "value"]) &&
            isNonEmptyString(item.value)
        ) {
            blocks.push({ type: "text", value: item.value });
            continue;
        }

        if (
            item.type === "video" &&
            hasExactKeys(item, ["type", "url"]) &&
            isValidUrl(item.url)
        ) {
            blocks.push({ type: "video", url: item.url });
            continue;
        }

        if (
            item.type === "resource" &&
            hasExactKeys(item, ["type", "url", "label"]) &&
            isValidUrl(item.url) &&
            isNonEmptyString(item.label)
        ) {
            blocks.push({
                type: "resource",
                url: item.url,
                label: item.label,
            });
            continue;
        }

        return { ok: false, message: `Invalid block at index ${i}.` };
    }

    return { ok: true, blocks };
};

const LessonContentEditorPage = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const location = useLocation();
    const state = location.state as LocationState | null;
    const fallbackCourseId = state?.courseId;
    const safeLessonId = lessonId ?? "";
    const { getErrorMessage } = useApiError();

    const {
        data: lesson,
        isLoading,
        isError,
        error,
    } = useLessonByIdQuery(safeLessonId);
    const updateLessonContent = useUpdateLessonContentMutation();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const courseId = useMemo(
        () => lesson?.courseId ?? fallbackCourseId ?? "",
        [lesson?.courseId, fallbackCourseId],
    );
    const backTo = courseId ? `/admin/courses/${courseId}/curriculum` : "/admin/courses";

    const handleSave = () => {
        if (!safeLessonId) return;
        const rawContent = textareaRef.current?.value ?? "[]";

        const parsed = parseLessonContent(rawContent);
        if (!parsed.ok) {
            alert(parsed.message);
            return;
        }

        if (!courseId) {
            alert("Unable to resolve course context.");
            return;
        }

        updateLessonContent.mutate(
            {
                lessonId: safeLessonId,
                courseId,
                content: parsed.blocks,
            },
            {
                onSuccess: () => {
                    alert("Content saved");
                },
                onError: (mutationError) => {
                    alert(getErrorMessage(mutationError));
                },
            },
        );
    };

    if (!safeLessonId) {
        return <p className="p-6 text-red-600">Invalid lesson id.</p>;
    }

    if (isLoading) {
        return <p className="p-6 text-gray-500">Loading lesson...</p>;
    }

    if (isError || !lesson) {
        return <p className="p-6 text-red-600">{getErrorMessage(error)}</p>;
    }

    return (
        <div className="p-6">
            <div className="mb-4">
                <Link
                    to={backTo}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to Curriculum
                </Link>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                    Edit Lesson Content
                </h1>
                <p className="mt-1 text-sm text-gray-500">{lesson.title}</p>
            </div>

            <textarea
                key={lesson.id}
                ref={textareaRef}
                defaultValue={JSON.stringify(lesson.content ?? [], null, 2)}
                className="min-h-[360px] w-full rounded-md border border-gray-300 p-3 font-mono text-sm"
            />

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={updateLessonContent.isPending}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {updateLessonContent.isPending ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default LessonContentEditorPage;
