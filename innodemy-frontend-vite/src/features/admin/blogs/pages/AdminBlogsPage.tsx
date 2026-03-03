import { Link } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import AdminBlogRow from "../components/AdminBlogRow";
import { useAdminBlogsQuery } from "../hooks";

const AdminBlogsPage = () => {
    // Basic pagination (v1)
    const page = 1;
    const limit = 50;

    const { data, isLoading, isError, error } = useAdminBlogsQuery(page, limit);
    const { getErrorMessage } = useApiError();

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading blogs...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <p className="text-red-600">{getErrorMessage(error)}</p>
            </div>
        );
    }

    const blogs = data?.data ?? [];

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your blog posts here.
                    </p>
                </div>
                <Link
                    to="/admin/blogs/create"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Create Blog
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-sm font-medium text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Created At</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {blogs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    No blogs found.
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <AdminBlogRow key={blog.id} blog={blog} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlogsPage;
