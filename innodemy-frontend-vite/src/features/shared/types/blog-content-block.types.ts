/**
 * Structured content blocks for blog posts.
 * Shared across admin and public features.
 */
export type BlogContentBlock =
    | { type: "text"; value: string }
    | { type: "image"; url: string; alt?: string }
    | { type: "heading"; value: string }
    | { type: "quote"; value: string };
