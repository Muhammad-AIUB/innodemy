/**
 * CurriculumBuilderPage — Admin curriculum management for a course.
 *
 * Route: /admin/courses/:id/curriculum
 *
 * Displays module tree with nested lessons.
 * Uses modals for creating/editing modules and lessons.
 * Single query: ['modules', courseId]. All mutations invalidate it.
 */

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    useModulesQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation,
    useReorderModuleMutation,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useReorderLessonMutation,
} from "../hooks";
import { useApiError } from "../../../../hooks/useApiError";
import ModuleItem from "../components/ModuleItem";
import CreateModuleModal from "../components/CreateModuleModal";
import EditModuleModal from "../components/EditModuleModal";
import CreateLessonModal from "../components/CreateLessonModal";
import EditLessonModal from "../components/EditLessonModal";
import type { ReorderDirection, Module, Lesson } from "../types";

const CurriculumBuilderPage = () => {
    const { id: courseId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getErrorMessage } = useApiError();

    /* ── Query ──────────────────────────────────────────── */
    const {
        data: modules,
        isLoading,
        isError,
        error,
    } = useModulesQuery(courseId ?? "");

    /* ── Module mutations ───────────────────────────────── */
    const createModule = useCreateModuleMutation(courseId ?? "");
    const updateModule = useUpdateModuleMutation(courseId ?? "");
    const deleteModule = useDeleteModuleMutation(courseId ?? "");
    const reorderModule = useReorderModuleMutation(courseId ?? "");

    const [deletingModuleId, setDeletingModuleId] = useState<string | null>(
        null,
    );
    const [reorderingModuleId, setReorderingModuleId] = useState<string | null>(
        null,
    );
    const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);

    /* ── Lesson mutations ───────────────────────────────── */
    const createLesson = useCreateLessonMutation(courseId ?? "");
    const updateLesson = useUpdateLessonMutation(courseId ?? "");
    const deleteLesson = useDeleteLessonMutation(courseId ?? "");
    const reorderLesson = useReorderLessonMutation(courseId ?? "");

    const [deletingLessonId, setDeletingLessonId] = useState<string | null>(
        null,
    );
    const [reorderingLessonId, setReorderingLessonId] = useState<string | null>(
        null,
    );
    const [creatingLessonForModuleId, setCreatingLessonForModuleId] = useState<
        string | null
    >(null);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    /* ── Module handlers ────────────────────────────────── */
    const handleAddModule = () => {
        setShowCreateModuleModal(true);
    };

    const handleCreateModuleSubmit = (data: { title: string }) => {
        createModule.mutate(data, {
            onSuccess: () => {
                setShowCreateModuleModal(false);
            },
            onError: (err) => alert(getErrorMessage(err)),
        });
    };

    const handleEditModule = (moduleId: string) => {
        const current = modules?.find((m) => m.id === moduleId);
        if (current) {
            setEditingModule(current);
        }
    };

    const handleEditModuleSubmit = (data: { title: string }) => {
        if (!editingModule) return;

        updateModule.mutate(
            { moduleId: editingModule.id, payload: data },
            {
                onSuccess: () => {
                    setEditingModule(null);
                },
                onError: (err) => alert(getErrorMessage(err)),
            },
        );
    };

    const handleDeleteModule = (moduleId: string) => {
        const confirmed = window.confirm(
            "Delete this module and ALL its lessons? This cannot be undone.",
        );
        if (!confirmed) return;

        setDeletingModuleId(moduleId);
        deleteModule.mutate(moduleId, {
            onSettled: () => setDeletingModuleId(null),
            onError: (err) => alert(getErrorMessage(err)),
        });
    };

    const handleReorderModule = (
        moduleId: string,
        direction: ReorderDirection,
    ) => {
        setReorderingModuleId(moduleId);
        reorderModule.mutate(
            { moduleId, direction },
            {
                onSettled: () => setReorderingModuleId(null),
                onError: (err) => alert(getErrorMessage(err)),
            },
        );
    };

    /* ── Lesson handlers ────────────────────────────────── */
    const handleAddLesson = (moduleId: string) => {
        setCreatingLessonForModuleId(moduleId);
    };

    const handleCreateLessonSubmit = (data: {
        title: string;
        type: "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT";
        videoUrl?: string;
    }) => {
        if (!creatingLessonForModuleId) return;

        createLesson.mutate(
            {
                moduleId: creatingLessonForModuleId,
                payload: {
                    title: data.title,
                    type: data.type,
                    videoUrl: data.videoUrl || undefined,
                },
            },
            {
                onSuccess: () => {
                    setCreatingLessonForModuleId(null);
                },
                onError: (err) => alert(getErrorMessage(err)),
            },
        );
    };

    const handleEditLesson = (lessonId: string) => {
        const lesson = modules
            ?.flatMap((m) => m.lessons)
            .find((l) => l.id === lessonId);
        if (lesson) {
            setEditingLesson(lesson);
        }
    };

    const handleEditLessonSubmit = (data: {
        title: string;
        type: "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT";
        videoUrl?: string;
    }) => {
        if (!editingLesson) return;

        updateLesson.mutate(
            {
                lessonId: editingLesson.id,
                payload: {
                    title: data.title,
                    type: data.type,
                    videoUrl: data.videoUrl || undefined,
                },
            },
            {
                onSuccess: () => {
                    setEditingLesson(null);
                },
                onError: (err) => alert(getErrorMessage(err)),
            },
        );
    };

    const handleDeleteLesson = (lessonId: string) => {
        const confirmed = window.confirm("Delete this lesson?");
        if (!confirmed) return;

        setDeletingLessonId(lessonId);
        deleteLesson.mutate(lessonId, {
            onSettled: () => setDeletingLessonId(null),
            onError: (err) => alert(getErrorMessage(err)),
        });
    };

    const handleReorderLesson = (
        lessonId: string,
        direction: ReorderDirection,
    ) => {
        setReorderingLessonId(lessonId);
        reorderLesson.mutate(
            { lessonId, direction },
            {
                onSettled: () => setReorderingLessonId(null),
                onError: (err) => alert(getErrorMessage(err)),
            },
        );
    };

    const handleEditLessonContent = (lessonId: string) => {
        navigate(`/admin/lessons/${lessonId}/content`, {
            state: { courseId },
        });
    };

    /* ── Render ─────────────────────────────────────────── */
    return (
        <>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link
                            to="/admin/courses"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back to Courses
                        </Link>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900">
                            Curriculum Builder
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddModule}
                        disabled={createModule.isPending}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        + Add Module
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <p className="py-4 text-gray-500">Loading curriculum...</p>
                )}

                {/* Error */}
                {isError && (
                    <p className="py-4 text-red-600">
                        {getErrorMessage(error)}
                    </p>
                )}

                {/* Empty state */}
                {modules && modules.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                        <p className="text-gray-500">
                            No modules yet. Click "+ Add Module" to start
                            building the curriculum.
                        </p>
                    </div>
                )}

                {/* Modules list */}
                {modules && modules.length > 0 && (
                    <div className="space-y-4">
                        {modules.map((mod, index) => (
                            <ModuleItem
                                key={mod.id}
                                module={mod}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === modules.length - 1}
                                onEditModule={handleEditModule}
                                onDeleteModule={handleDeleteModule}
                                isDeletingModule={deletingModuleId === mod.id}
                                onReorderModule={handleReorderModule}
                                isReorderingModule={
                                    reorderingModuleId === mod.id
                                }
                                onAddLesson={handleAddLesson}
                                onEditLesson={handleEditLesson}
                                onEditLessonContent={handleEditLessonContent}
                                onDeleteLesson={handleDeleteLesson}
                                deletingLessonId={deletingLessonId}
                                onReorderLesson={handleReorderLesson}
                                reorderingLessonId={reorderingLessonId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateModuleModal
                isOpen={showCreateModuleModal}
                onClose={() => setShowCreateModuleModal(false)}
                onSubmit={handleCreateModuleSubmit}
                isPending={createModule.isPending}
            />

            <EditModuleModal
                isOpen={editingModule !== null}
                module={editingModule}
                onClose={() => setEditingModule(null)}
                onSubmit={handleEditModuleSubmit}
                isPending={updateModule.isPending}
            />

            <CreateLessonModal
                isOpen={creatingLessonForModuleId !== null}
                onClose={() => setCreatingLessonForModuleId(null)}
                onSubmit={handleCreateLessonSubmit}
                isPending={createLesson.isPending}
            />

            <EditLessonModal
                isOpen={editingLesson !== null}
                lesson={editingLesson}
                onClose={() => setEditingLesson(null)}
                onSubmit={handleEditLessonSubmit}
                isPending={updateLesson.isPending}
            />
        </>
    );
};

export default CurriculumBuilderPage;
