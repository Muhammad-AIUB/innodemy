import type { BlogContentBlock } from "../../shared/types/blog-content-block.types";

export interface AdminBlogAuthor {
    id: string;
    name: string;
    bio: string | null;
    avatar: string | null;
}

export interface AdminBlogCategory {
    id: string;
    name: string;
    slug: string;
}

export interface AdminBlogTag {
    id: string;
    name: string;
}

export interface AdminBlogSEO {
    title: string | null;
    description: string | null;
    keywords: string[];
}

export interface AdminBlog {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: unknown;
    contentBlocks: BlogContentBlock[];
    bannerImage: string | null;
    readDuration: number | null;
    publishedAt: string | null;
    author: AdminBlogAuthor;
    category: AdminBlogCategory | null;
    tags: AdminBlogTag[];
    seo: AdminBlogSEO;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedAdminBlogsResponse {
    data: AdminBlog[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
