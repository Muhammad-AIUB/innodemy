import { z } from "zod";

export const sendOtpSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
});

export const verifyOtpSchema = z.object({
    code: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export const completeProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[0-9]/, "Password must contain at least 1 number"),
    phoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\+?[\d\s-]{7,15}$/, "Please provide a valid phone number"),
});

export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
