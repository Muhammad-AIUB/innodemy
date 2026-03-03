import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendOtpSchema, type SendOtpFormValues } from "../register/schema";
import type { AppError } from "../../../api/error";

interface RegisterStep1Props {
    onSubmit: (email: string) => void;
    isPending: boolean;
    error: AppError | null;
    onSwitchToLogin: () => void;
    prefillEmail?: string;
}

export const RegisterStep1 = memo(
    ({
        onSubmit,
        isPending,
        error,
        onSwitchToLogin,
        prefillEmail,
    }: RegisterStep1Props) => {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<SendOtpFormValues>({
            resolver: zodResolver(sendOtpSchema),
            defaultValues: {
                email: prefillEmail || "",
            },
        });

        const handleFormSubmit = (data: SendOtpFormValues) => {
            onSubmit(data.email);
        };

        return (
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                <p className="text-sm text-gray-600">
                    Step 1 of 3: Enter your email to receive a verification
                    code.
                </p>

                <div>
                    <label
                        htmlFor="register-email"
                        className="block text-sm font-medium"
                    >
                        Email
                    </label>
                    <input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        {...register("email")}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
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
                    {isPending ? "Sending OTP..." : "Send OTP"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="font-medium text-black underline"
                    >
                        Sign in
                    </button>
                </p>
            </form>
        );
    },
);

RegisterStep1.displayName = "RegisterStep1";
