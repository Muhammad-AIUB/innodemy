import { Link } from "react-router-dom";
import type { PublicBlogList } from "../types";

interface BlogCardProps {
    blog: PublicBlogList;
}

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const BlogCard = ({ blog }: BlogCardProps) => {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
            {/* Banner Image */}
            <Link
                to={`/blogs/${blog.slug}`}
                className="aspect-[16/9] w-full overflow-hidden bg-gray-100"
            >
                {blog.bannerImage ? (
                    <img
                        src={blog.bannerImage}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                        No image
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
                <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2 hover:text-blue-600">
                        {blog.title}
                    </h3>
                </Link>

                {blog.excerpt && (
                    <p className="mb-4 text-sm text-gray-600 line-clamp-3 flex-1">
                        {blog.excerpt}
                    </p>
                )}

                {/* Footer metadata */}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <span>
                        {blog.publishedAt
                            ? formatDate(blog.publishedAt)
                            : "Draft"}
                    </span>
                    {blog.readDuration && (
                        <span>{blog.readDuration} min read</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
