import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "../hooks";
import { useAuthStore } from "../../../stores/authStore";
import { UserRole } from "../../../types/auth.types";

const loginSchema = z.object({
    email: z.email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const roleRedirectMap: Record<UserRole, string> = {
    [UserRole.STUDENT]: "/app/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.SUPER_ADMIN]: "/super-admin/dashboard",
};

const LoginPage = () => {
    const navigate = useNavigate();
    const role = useAuthStore((state) => state.role);
    const token = useAuthStore((state) => state.token);
    const loginMutation = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    // Redirect already-authenticated users
    useEffect(() => {
        console.log("🔍 LoginPage useEffect:", { token, role });
        if (token && role) {
            console.log(
                "✅ Redirecting from useEffect to:",
                roleRedirectMap[role],
            );
            navigate(roleRedirectMap[role], { replace: true });
        }
    }, [token, role, navigate]);

    const onSubmit = (data: LoginFormValues) => {
        console.log("📝 Login form submitted:", data.email);
        loginMutation.mutate(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold">Login</h1>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                    >
                        Email
                    </label>
                    <input
                        id="email"
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

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                    >
                        Password
                    </label>
                    <input
                        id="password"
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

                {loginMutation.isError && (
                    <p className="text-sm text-red-600">
                        Invalid email or password. Please try again.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
