import { Link } from "react-router-dom";
import type { AdminWebinar } from "../types";

interface AdminWebinarRowProps {
    webinar: AdminWebinar;
    onPublish: (id: string) => void;
    onDelete: (id: string) => void;
    isActioning: boolean;
}

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
    DRAFT: { bg: "bg-yellow-100", text: "text-yellow-800" },
    PUBLISHED: { bg: "bg-green-100", text: "text-green-800" },
};

const AdminWebinarRow = ({
    webinar,
    onPublish,
    onDelete,
    isActioning,
}: AdminWebinarRowProps) => {
    const badge = STATUS_BADGE[webinar.status] ?? STATUS_BADGE.DRAFT;

    return (
        <tr className="border-b border-gray-100 text-sm">
            <td className="px-4 py-3 font-medium text-gray-900">
                {webinar.title}
            </td>
            <td className="px-4 py-3 text-gray-600">
                {formatDate(webinar.date)}
            </td>
            <td className="px-4 py-3 text-gray-600">
                {webinar.instructor ?? "—"}
            </td>
            <td className="px-4 py-3 text-gray-600">
                {webinar.category ?? "—"}
            </td>
            <td className="px-4 py-3">
                <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
                >
                    {webinar.status}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex gap-2">
                    <Link
                        to={`/admin/webinars/${webinar.id}/edit`}
                        className="rounded bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-gray-800"
                    >
                        Edit
                    </Link>
                    {webinar.status === "DRAFT" && (
                        <button
                            type="button"
                            disabled={isActioning}
                            onClick={() => onPublish(webinar.id)}
                            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Publish
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={isActioning}
                        onClick={() => onDelete(webinar.id)}
                        className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AdminWebinarRow;
