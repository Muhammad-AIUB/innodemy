import { useParams } from "react-router-dom";
import { usePublicBlogDetailQuery } from "../hooks";
import { useApiError } from "../../../../hooks/useApiError";
import BlogContentRenderer from "../components/BlogContentRenderer";
import type { BlogContentBlock } from "../../../shared/types/blog-content-block.types";

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const BlogDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const {
        data: blog,
        isLoading,
        isError,
        error,
    } = usePublicBlogDetailQuery(slug ?? "");
    const { getErrorMessage } = useApiError();

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12 text-gray-500">
                Loading article...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12 text-red-600">
                {getErrorMessage(error)}
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12 text-gray-500">
                Blog not found.
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-4xl px-6 py-12">
            {/* Header / Meta */}
            <header className="mb-10 text-center">
                {blog.category && (
                    <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {blog.category.name}
                    </span>
                )}

                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    {blog.title}
                </h1>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        {blog.author.avatar ? (
                            <img
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600">
                                {blog.author.name.charAt(0)}
                            </div>
                        )}
                        <span className="font-medium text-gray-900">
                            {blog.author.name}
                        </span>
                    </div>

                    <span className="text-gray-300">•</span>

                    <time dateTime={blog.publishedAt ?? undefined}>
                        {blog.publishedAt
                            ? formatDate(blog.publishedAt)
                            : "Draft"}
                    </time>

                    {blog.readDuration && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span>{blog.readDuration} min read</span>
                        </>
                    )}
                </div>
            </header>

            {/* Banner Image */}
            {blog.bannerImage && (
                <figure className="mb-12 overflow-hidden rounded-xl">
                    <img
                        src={blog.bannerImage}
                        alt={blog.title}
                        className="w-full h-auto object-cover"
                    />
                </figure>
            )}

            {/* Content — structured blocks preferred, legacy fallback */}
            <div className="prose prose-lg prose-blue mx-auto max-w-none text-gray-700">
                {Array.isArray(blog.contentBlocks) &&
                blog.contentBlocks.length > 0 ? (
                    <BlogContentRenderer
                        blocks={blog.contentBlocks as BlogContentBlock[]}
                    />
                ) : (
                    <div className="whitespace-pre-wrap">
                        {typeof blog.content === "string"
                            ? blog.content
                            : JSON.stringify(blog.content, null, 2)}
                    </div>
                )}
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2 border-t border-gray-100 pt-8">
                    {blog.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            )}
        </article>
    );
};

export default BlogDetailPage;
