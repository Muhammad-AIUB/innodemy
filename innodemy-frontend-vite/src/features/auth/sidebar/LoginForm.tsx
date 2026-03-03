import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AppError } from "../../../api/error";
import { useCheckEmailMutation } from "../register/hooks";

const loginSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string }) => void;
    isPending: boolean;
    error: AppError | null;
    onSwitchToRegister: (email?: string) => void;
}

export const LoginForm = memo(
    ({ onSubmit, isPending, error, onSwitchToRegister }: LoginFormProps) => {
        const [emailChecked, setEmailChecked] = useState(false);
        const [emailExists, setEmailExists] = useState(true);
        const [checkedEmail, setCheckedEmail] = useState("");

        const checkEmailMutation = useCheckEmailMutation();

        const {
            register,
            handleSubmit,
            formState: { errors },
            watch,
        } = useForm<LoginFormValues>({
            resolver: zodResolver(loginSchema),
        });

        const emailValue = watch("email");

        const handleEmailBlur = () => {
            const email = emailValue?.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return;
            }

            if (email === checkedEmail) {
                return; // Already checked this email
            }

            checkEmailMutation.mutate(
                { email },
                {
                    onSuccess: (response) => {
                        setCheckedEmail(email);
                        setEmailChecked(true);
                        setEmailExists(response.exists);
                    },
                },
            );
        };

        const handleFormSubmit = (data: LoginFormValues) => {
            if (!emailExists) {
                // Don't submit if email doesn't exist
                return;
            }
            onSubmit(data);
        };

        return (
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                <div>
                    <label
                        htmlFor="login-email"
                        className="block text-sm font-medium"
                    >
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        {...register("email")}
                        onBlur={handleEmailBlur}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                    {checkEmailMutation.isPending && (
                        <p className="mt-1 text-sm text-gray-500">
                            Checking email...
                        </p>
                    )}
                    {emailChecked && !emailExists && (
                        <div className="mt-2 rounded-md bg-blue-50 p-3">
                            <p className="text-sm text-blue-800">
                                Email not found. If you don&apos;t have an
                                account,{" "}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSwitchToRegister(emailValue)
                                    }
                                    className="font-semibold underline hover:text-blue-900"
                                >
                                    you can create one with this email
                                </button>
                                .
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="login-password"
                        className="block text-sm font-medium"
                    >
                        Password
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        {...register("password")}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isPending || (emailChecked && !emailExists)}
                    className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {isPending ? "Signing in..." : "Sign in"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={() => onSwitchToRegister()}
                        className="font-medium text-black underline"
                    >
                        Register
                    </button>
                </p>
            </form>
        );
    },
);

LoginForm.displayName = "LoginForm";
