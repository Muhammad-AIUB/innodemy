import { z } from "zod";

export const BlogSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    excerpt: z.string().optional(),
    content: z.string().min(10, "Content must be at least 10 characters"),
    bannerImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    authorId: z.string().uuid("Must select a valid author"),
    categoryId: z.string().uuid("Must be a valid UUID").optional().or(z.literal("")),
    readDuration: z.number().min(1, "Must be at least 1 minute").optional(),
});
