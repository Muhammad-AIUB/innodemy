import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOtpFormValues } from "../register/schema";
import type { AppError } from "../../../api/error";

interface RegisterStep2Props {
    onSubmit: (code: string) => void;
    isPending: boolean;
    error: AppError | null;
    email: string;
}

export const RegisterStep2 = memo(
    ({ onSubmit, isPending, error, email }: RegisterStep2Props) => {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<VerifyOtpFormValues>({
            resolver: zodResolver(verifyOtpSchema),
        });

        const handleFormSubmit = (data: VerifyOtpFormValues) => {
            onSubmit(data.code);
        };

        return (
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                <p className="text-sm text-gray-600">
                    Step 2 of 3: Enter the 6-digit code sent to{" "}
                    <strong>{email}</strong>.
                </p>

                <div>
                    <label
                        htmlFor="otp-code"
                        className="block text-sm font-medium"
                    >
                        Verification Code
                    </label>
                    <input
                        id="otp-code"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="one-time-code"
                        {...register("code")}
                        className="mt-1 w-full rounded border px-3 py-2 text-center tracking-widest"
                    />
                    {errors.code && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.code.message}
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
                    {isPending ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        );
    },
);

RegisterStep2.displayName = "RegisterStep2";
