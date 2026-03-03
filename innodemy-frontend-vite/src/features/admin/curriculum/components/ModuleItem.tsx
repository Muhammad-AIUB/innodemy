/**
 * ModuleItem — Presentational component for a single module + its lessons.
 */

import type { Module, ReorderDirection } from "../types";
import LessonItem from "./LessonItem";

interface ModuleItemProps {
    module: Module;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    onEditModule: (moduleId: string) => void;
    onDeleteModule: (moduleId: string) => void;
    isDeletingModule: boolean;
    onReorderModule: (moduleId: string, direction: ReorderDirection) => void;
    isReorderingModule: boolean;
    onAddLesson: (moduleId: string) => void;
    onEditLesson: (lessonId: string) => void;
    onEditLessonContent: (lessonId: string) => void;
    onDeleteLesson: (lessonId: string) => void;
    deletingLessonId: string | null;
    onReorderLesson: (lessonId: string, direction: ReorderDirection) => void;
    reorderingLessonId: string | null;
}

const ModuleItem = ({
    module,
    index,
    isFirst,
    isLast,
    onEditModule,
    onDeleteModule,
    isDeletingModule,
    onReorderModule,
    isReorderingModule,
    onAddLesson,
    onEditLesson,
    onEditLessonContent,
    onDeleteLesson,
    deletingLessonId,
    onReorderLesson,
    reorderingLessonId,
}: ModuleItemProps) => {
    return (
        <div className="rounded-lg border border-gray-300 bg-gray-50">
            {/* Module header */}
            <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">
                    Module {index + 1}: {module.title}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={isFirst || isReorderingModule}
                        onClick={() => onReorderModule(module.id, "up")}
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Move Up"
                    >
                        ↑ Move Up
                    </button>
                    <button
                        type="button"
                        disabled={isLast || isReorderingModule}
                        onClick={() => onReorderModule(module.id, "down")}
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Move Down"
                    >
                        ↓ Move Down
                    </button>
                    <button
                        type="button"
                        onClick={() => onAddLesson(module.id)}
                        className="rounded bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-gray-800"
                    >
                        + Add Lesson
                    </button>
                    <button
                        type="button"
                        onClick={() => onEditModule(module.id)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        disabled={isDeletingModule}
                        onClick={() => onDeleteModule(module.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                        {isDeletingModule ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>

            {/* Lessons list */}
            <div className="space-y-2 p-4">
                {module.lessons.length === 0 && (
                    <p className="text-xs text-gray-400">
                        No lessons yet. Click "+ Add Lesson" to begin.
                    </p>
                )}
                {module.lessons.map((lesson, lessonIndex) => (
                    <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        isFirst={lessonIndex === 0}
                        isLast={lessonIndex === module.lessons.length - 1}
                        onEdit={onEditLesson}
                        onEditContent={onEditLessonContent}
                        onDelete={onDeleteLesson}
                        isDeleting={deletingLessonId === lesson.id}
                        onReorder={onReorderLesson}
                        isReordering={reorderingLessonId === lesson.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default ModuleItem;
