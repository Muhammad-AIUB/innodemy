import type { BlogContentBlock } from "../../../shared/types/blog-content-block.types";

/**
 * Converts plain textarea content into structured content blocks.
 * Splits by double newline to produce individual text blocks.
 * Empty paragraphs are filtered out.
 */
export const serializeBlogContent = (raw: string): BlogContentBlock[] => {
    if (!raw || raw.trim().length === 0) return [];

    return raw
        .split(/\n\n+/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
        .map(
            (paragraph): BlogContentBlock => ({
                type: "text",
                value: paragraph,
            }),
        );
};
