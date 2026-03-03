import { usePublicBlogsQuery } from "../hooks";
import { useApiError } from "../../../../hooks/useApiError";
import BlogCard from "../components/BlogCard";

const BlogsPage = () => {
    // Basic pagination setup
    const page = 1;
    const limit = 50;

    const { data, isLoading, isError, error } = usePublicBlogsQuery(
        page,
        limit,
    );
    const { getErrorMessage } = useApiError();

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-gray-500">Loading blogs...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-red-600">{getErrorMessage(error)}</p>
            </div>
        );
    }

    const blogs = data?.data ?? [];

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Our Blog
            </h1>
            <p className="mb-10 text-gray-600">
                Latest news, tutorials, and updates.
            </p>

            {blogs.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
                    No blogs published yet.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogsPage;
