import type { BlogContentBlock } from "../../../shared/types/blog-content-block.types";

interface BlogContentRendererProps {
    blocks: BlogContentBlock[];
}

/**
 * Pure presentational renderer for structured blog content blocks.
 * Unknown block types are silently ignored (fail-safe).
 */
const BlogContentRenderer = ({ blocks }: BlogContentRendererProps) => {
    return (
        <div className="space-y-6">
            {blocks.map((block, index) => {
                switch (block.type) {
                    case "text":
                        return (
                            <p
                                key={index}
                                className="text-base leading-relaxed text-gray-700"
                            >
                                {block.value}
                            </p>
                        );
                    case "heading":
                        return (
                            <h2
                                key={index}
                                className="text-2xl font-bold text-gray-900"
                            >
                                {block.value}
                            </h2>
                        );
                    case "image":
                        return (
                            <figure key={index} className="my-4">
                                <img
                                    src={block.url}
                                    alt={block.alt ?? ""}
                                    loading="lazy"
                                    className="w-full rounded-lg object-cover"
                                />
                                {block.alt && (
                                    <figcaption className="mt-2 text-center text-sm text-gray-500">
                                        {block.alt}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    case "quote":
                        return (
                            <blockquote
                                key={index}
                                className="border-l-4 border-blue-500 bg-blue-50 py-3 pl-4 pr-3 italic text-gray-700"
                            >
                                {block.value}
                            </blockquote>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default BlogContentRenderer;
