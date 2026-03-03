import { Link } from "react-router-dom";
import type { AdminBlog } from "../types";
import { usePublishBlogMutation, useDeleteBlogMutation } from "../hooks";

interface AdminBlogRowProps {
    blog: AdminBlog;
}

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const AdminBlogRow = ({ blog }: AdminBlogRowProps) => {
    const publishMutation = usePublishBlogMutation();
    const deleteMutation = useDeleteBlogMutation();

    const handlePublish = () => {
        if (confirm("Are you sure you want to publish this blog?")) {
            publishMutation.mutate(blog.id);
        }
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this blog?")) {
            deleteMutation.mutate(blog.id);
        }
    };

    return (
        <tr className="border-b border-gray-100 text-sm hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-900">
                {blog.title}
            </td>
            <td className="px-4 py-3">
                <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        blog.status === "PUBLISHED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {blog.status}
                </span>
            </td>
            <td className="px-4 py-3 text-gray-500">
                {formatDate(blog.createdAt)}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                    <Link
                        to={`/admin/blogs/${blog.id}/edit`}
                        className="rounded px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                        Edit
                    </Link>
                    {blog.status === "DRAFT" && (
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={publishMutation.isPending}
                            className="rounded px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                        >
                            Publish
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AdminBlogRow;
