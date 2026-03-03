import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Lesson } from "../types";
import VideoPlayer from "./VideoPlayer";
import { useAuthStore } from "../../../../stores/authStore";

interface LessonContentProps {
    lesson: Lesson;
    courseId: string;
    nextLesson: Lesson | null;
    isCompleted: boolean;
    onMarkComplete: () => void;
    isMarkingComplete: boolean;
    onAutoMarkComplete: () => void;
}

const LessonContent = ({
    lesson,
    courseId,
    nextLesson,
    isCompleted,
    onMarkComplete,
    isMarkingComplete,
    onAutoMarkComplete,
}: LessonContentProps) => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hasAutoTriggeredRef = useRef(false);
    const contentBlocks = lesson.content ?? [];
    const hasContentBlocks = contentBlocks.length > 0;

    // Get current user for video watermarking
    const user = useAuthStore((s) => s.user);

    const handleNextLesson = () => {
        if (nextLesson) {
            navigate(`/app/courses/${courseId}/lessons/${nextLesson.id}`);
        }
    };

    useEffect(() => {
        hasAutoTriggeredRef.current = false;
    }, [lesson.id]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const maybeAutoComplete = () => {
            if (
                isCompleted ||
                isMarkingComplete ||
                hasAutoTriggeredRef.current
            ) {
                return;
            }

            const isAtBottom =
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 8;

            if (isAtBottom) {
                hasAutoTriggeredRef.current = true;
                onAutoMarkComplete();
            }
        };

        container.addEventListener("scroll", maybeAutoComplete, {
            passive: true,
        });

        // Don't auto-complete on mount — only on actual user scroll.
        // This prevents lessons from being instantly marked complete
        // when content is short and doesn't overflow.

        return () => {
            container.removeEventListener("scroll", maybeAutoComplete);
        };
    }, [isCompleted, isMarkingComplete, onAutoMarkComplete, lesson.id]);

    return (
        <div
            ref={containerRef}
            className="h-full min-h-0 flex-1 overflow-y-auto p-6"
        >
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <span className="mt-1 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs">
                {lesson.type}
            </span>

            {hasContentBlocks ? (
                <div className="mt-4 space-y-4 rounded border border-gray-200 p-4">
                    {contentBlocks.map((block, index) => {
                        if (block.type === "text") {
                            return <p key={`text-${index}`}>{block.value}</p>;
                        }

                        if (block.type === "video") {
                            return (
                                <div key={`video-${index}`}>
                                    <VideoPlayer
                                        url={block.url ?? ""}
                                        userEmail={user?.email}
                                        userId={user?.id}
                                    />
                                </div>
                            );
                        }

                        if (block.type === "resource") {
                            return (
                                <a
                                    key={`resource-${index}`}
                                    href={block.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    {block.label}
                                </a>
                            );
                        }

                        return null;
                    })}
                </div>
            ) : lesson.videoUrl ? (
                <div className="mt-4">
                    <VideoPlayer
                        url={lesson.videoUrl}
                        userEmail={user?.email}
                        userId={user?.id}
                        onEnded={() => {
                            if (!isCompleted && !isMarkingComplete) {
                                onAutoMarkComplete();
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="mt-4 rounded border p-6 text-center text-gray-500">
                    No lesson content available.
                </div>
            )}

            <div className="mt-6 flex items-center gap-4">
                {isCompleted ? (
                    <span className="text-sm font-medium text-green-700">
                        ✓ Completed
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={onMarkComplete}
                        disabled={isMarkingComplete}
                        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        {isMarkingComplete ? "Marking..." : "Mark Complete"}
                    </button>
                )}

                {nextLesson ? (
                    <button
                        type="button"
                        onClick={handleNextLesson}
                        className="rounded border border-black px-4 py-2 text-sm"
                    >
                        Next Lesson
                    </button>
                ) : (
                    <span className="text-sm font-medium">
                        Course Completed 🎉
                    </span>
                )}
            </div>
        </div>
    );
};

export default LessonContent;
