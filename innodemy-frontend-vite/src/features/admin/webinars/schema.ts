import { z } from "zod";

export const webinarSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(150, "Title must not exceed 150 characters"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    duration: z.number().int().min(1, "Duration must be at least 1 minute"),
    image: z.string().optional(),
    time: z.string().optional(),
    instructorId: z.string().optional(),
    // Legacy fields (kept for backward compatibility)
    instructor: z.string().optional(),
    instructorImage: z.string().optional(),
    category: z.string().optional(),
    sectionOneTitle: z.string().optional(),
    sectionOnePointsRaw: z.string().optional(),
    sectionTwoTitle: z.string().optional(),
    sectionTwoPointsRaw: z.string().optional(),
});

export type WebinarFormValues = z.infer<typeof webinarSchema>;
