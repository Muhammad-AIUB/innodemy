/**
 * LessonItem — Pure presentational component for a single lesson row.
 */

import type { Lesson, ReorderDirection } from "../types";

const typeIcons: Record<Lesson["type"], string> = {
    VIDEO: "🎬",
    QUIZ: "📝",
    ASSIGNMENT: "📋",
};

interface LessonItemProps {
    lesson: Lesson;
    isFirst: boolean;
    isLast: boolean;
    onEdit: (lessonId: string) => void;
    onEditContent: (lessonId: string) => void;
    onDelete: (lessonId: string) => void;
    isDeleting: boolean;
    onReorder: (lessonId: string, direction: ReorderDirection) => void;
    isReordering: boolean;
}

const LessonItem = ({
    lesson,
    isFirst,
    isLast,
    onEdit,
    onEditContent,
    onDelete,
    isDeleting,
    onReorder,
    isReordering,
}: LessonItemProps) => {
    return (
        <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>{typeIcons[lesson.type]}</span>
                <span>{lesson.title}</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                    {lesson.type}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={isFirst || isReordering}
                    onClick={() => onReorder(lesson.id, "up")}
                    className="rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                    title="Move up"
                >
                    ↑
                </button>
                <button
                    type="button"
                    disabled={isLast || isReordering}
                    onClick={() => onReorder(lesson.id, "down")}
                    className="rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                    title="Move down"
                >
                    ↓
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(lesson.id)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onEditContent(lesson.id)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                    Edit Content
                </button>
                <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => onDelete(lesson.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
};

export default LessonItem;
