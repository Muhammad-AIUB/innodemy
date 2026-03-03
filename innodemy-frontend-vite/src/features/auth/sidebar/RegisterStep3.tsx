import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    completeProfileSchema,
    type CompleteProfileFormValues,
} from "../register/schema";
import type { AppError } from "../../../api/error";

interface RegisterStep3Props {
    onSubmit: (data: {
        name: string;
        email: string;
        password: string;
        phoneNumber: string;
    }) => void;
    isPending: boolean;
    error: AppError | null;
    email: string;
}

export const RegisterStep3 = memo(
    ({ onSubmit, isPending, error, email }: RegisterStep3Props) => {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<CompleteProfileFormValues>({
            resolver: zodResolver(completeProfileSchema),
            defaultValues: {
                email,
            },
        });

        const handleFormSubmit = (data: CompleteProfileFormValues) => {
            onSubmit({
                name: data.name,
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber,
            });
        };

        return (
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                <p className="text-sm text-gray-600">
                    Step 3 of 3: Complete your profile.
                </p>

                <div>
                    <label
                        htmlFor="register-name"
                        className="block text-sm font-medium"
                    >
                        Full Name
                    </label>
                    <input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        {...register("name")}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="register-email-display"
                        className="block text-sm font-medium"
                    >
                        Email
                    </label>
                    <input
                        id="register-email-display"
                        type="email"
                        disabled
                        {...register("email")}
                        className="mt-1 w-full rounded border bg-gray-100 px-3 py-2 text-gray-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="register-password"
                        className="block text-sm font-medium"
                    >
                        Password
                    </label>
                    <input
                        id="register-password"
                        type="password"
                        autoComplete="new-password"
                        {...register("password")}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="register-phone"
                        className="block text-sm font-medium"
                    >
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="register-phone"
                        type="tel"
                        autoComplete="tel"
                        {...register("phoneNumber")}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                    {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.phoneNumber.message}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {isPending ? "Creating account..." : "Create Account"}
                </button>
            </form>
        );
    },
);

RegisterStep3.displayName = "RegisterStep3";
