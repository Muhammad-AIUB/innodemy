import type {
    SubmitHandler,
    DefaultValues,
    FieldValues,
} from "react-hook-form";

/**
 * Generic submit handler type for admin forms.
 * Wraps React Hook Form's SubmitHandler to enforce consistent typing
 * across all admin form submissions.
 */
export type FormSubmitHandler<T extends FieldValues> = SubmitHandler<T>;

/**
 * Generic default values type for admin forms.
 * Wraps React Hook Form's DefaultValues to enforce consistent typing
 * when initializing form state.
 */
export type FormDefaultValues<T extends FieldValues> = DefaultValues<T>;
