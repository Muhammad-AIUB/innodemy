/**
 * useAdminForm — Centralized form hook for all admin CRUD forms.
 *
 * Every admin mutation form MUST use this hook instead of calling
 * useForm directly. This ensures:
 *   - Consistent Zod-based validation via zodResolver
 *   - Uniform default values handling
 *   - Predictable form instance typing across all admin features
 *
 * Usage:
 *   const form = useAdminForm({ schema: myZodSchema, defaultValues: { ... } });
 *
 * The returned form instance exposes register, handleSubmit, formState,
 * and all other React Hook Form utilities, fully typed to the schema.
 */

import {
    useForm,
    type UseFormReturn,
    type FieldValues,
    type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FormDefaultValues } from "./form.types";

interface UseAdminFormOptions<T extends FieldValues> {
    schema: z.ZodType<T>;
    defaultValues?: FormDefaultValues<T>;
}

export const useAdminForm = <T extends FieldValues>({
    schema,
    defaultValues,
}: UseAdminFormOptions<T>): UseFormReturn<T> => {
    // Zod v4's generic ZodType has `unknown` as input, which doesn't satisfy
    // zodResolver's FieldValues constraint. The assertion is safe because
    // concrete z.object() schemas always produce FieldValues-compatible input.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolver = zodResolver(schema as any) as Resolver<T>;

    return useForm<T>({
        resolver,
        defaultValues,
    });
};
