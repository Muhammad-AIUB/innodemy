import type { BlogContentBlock } from "../../shared/types/blog-content-block.types";

export interface PublicBlogAuthor {
    id: string;
    name: string;
    bio: string | null;
    avatar: string | null;
}

export interface PublicBlogCategory {
    id: string;
    name: string;
    slug: string;
}

export interface PublicBlogTag {
    id: string;
    name: string;
}

export interface PublicBlogSEO {
    title: string | null;
    description: string | null;
    keywords: string[];
}

export interface PublicBlogList {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    bannerImage: string | null;
    readDuration: number | null;
    publishedAt: string | null;
}

export interface PublicBlogDetail {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: unknown;
    contentBlocks: BlogContentBlock[];
    bannerImage: string | null;
    readDuration: number | null;
    publishedAt: string | null;
    author: PublicBlogAuthor;
    category: PublicBlogCategory | null;
    tags: PublicBlogTag[];
    seo: PublicBlogSEO;
}

export interface PaginatedBlogsResponse {
    data: PublicBlogList[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
