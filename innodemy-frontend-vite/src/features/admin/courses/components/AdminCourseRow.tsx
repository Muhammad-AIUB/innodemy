/**
 * AdminCourseRow — Pure presentational component
 *
 * Renders a single admin course row.
 * Contract aligned with: docs/backend-admin-courses-api.md
 */

import { Link } from "react-router-dom";
import type { AdminCourse } from "../types";

interface AdminCourseRowProps {
    course: AdminCourse;
    onPublish: (id: string) => void;
    isPublishing: boolean;
    publishingId: string | null;
    onDelete: (id: string) => void;
    isDeleting: boolean;
    deletingId: string | null;
}

const statusStyles: Record<AdminCourse["status"], string> = {
    DRAFT: "text-yellow-600 bg-yellow-50",
    PUBLISHED: "text-green-600 bg-green-50",
};

const AdminCourseRow = ({
    course,
    onPublish,
    isPublishing,
    publishingId,
    onDelete,
    isDeleting,
    deletingId,
}: AdminCourseRowProps) => {
    const formattedDate = new Date(course.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        },
    );

    const isMutatingThis = isPublishing && publishingId === course.id;
    const isDeletingThis = isDeleting && deletingId === course.id;

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {course.title}
            </td>
            <td className="px-4 py-3 text-sm">
                <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${statusStyles[course.status]}`}
                >
                    {course.status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">{formattedDate}</td>
            <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                    <Link
                        to={`/admin/courses/${course.id}/edit`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </Link>
                    <Link
                        to={`/admin/courses/${course.id}/curriculum`}
                        className="font-medium text-purple-600 hover:text-purple-800"
                    >
                        Curriculum
                    </Link>
                    <Link
                        to={`/admin/courses/${course.id}/analytics`}
                        state={{ courseTitle: course.title }}
                        className="font-medium text-teal-600 hover:text-teal-800"
                    >
                        Analytics
                    </Link>
                    <Link
                        to={`/app/courses/${course.slug}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                        Preview
                    </Link>
                    {course.status === "DRAFT" && (
                        <button
                            type="button"
                            disabled={isMutatingThis}
                            onClick={() => onPublish(course.id)}
                            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isMutatingThis ? "Publishing..." : "Publish"}
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={isDeletingThis}
                        onClick={() => onDelete(course.id)}
                        className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeletingThis ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AdminCourseRow;
