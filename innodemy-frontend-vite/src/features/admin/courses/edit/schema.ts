/**
 * Admin Edit Course — Zod Validation Schema
 *
 * Same validation rules as CreateCourseSchema.
 * Reused for the edit form to ensure consistent constraints.
 *
 * Validation rules mirror backend UpdateCourseDto (PartialType of CreateCourseDto).
 * All fields are required in the form since edit always sends the full subset.
 */

import { z } from "zod";

export const editCourseSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must not exceed 200 characters"),
    description: z.string().min(1, "Description is required"),
    bannerImage: z.string().url("Banner image must be a valid URL"),
    price: z.number().min(0, "Price must be at least 0"),
    discountPrice: z.number().min(0, "Discount price must be at least 0"),
    duration: z.number().int().min(1, "Duration must be at least 1 day"),
    startDate: z.string().min(1, "Start date is required"),
    classDays: z.string().min(1, "Class days are required"),
    classTime: z.string().min(1, "Class time is required"),
    totalModules: z.number().int().min(0, "Total modules must be at least 0"),
    totalProjects: z.number().int().min(0, "Total projects must be at least 0"),
    totalLive: z
        .number()
        .int()
        .min(0, "Total live sessions must be at least 0"),
});

export type EditCourseFormValues = z.infer<typeof editCourseSchema>;
