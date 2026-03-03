import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { useLoginMutation } from "../hooks";
import {
    useCheckEmailMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useRegisterMutation,
} from "../register/hooks";
import { LoginForm } from "./LoginForm";
import { RegisterStep1 } from "./RegisterStep1";
import { RegisterStep2 } from "./RegisterStep2";
import { RegisterStep3 } from "./RegisterStep3";
import type { RegisterStep } from "../register/types";
import { UserRole } from "../../../types/auth.types";

type SidebarMode = "login" | "register";

const roleRedirectMap: Record<UserRole, string> = {
    [UserRole.STUDENT]: "/app/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.SUPER_ADMIN]: "/super-admin/dashboard",
};

interface AuthSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthSidebar = memo(({ isOpen, onClose }: AuthSidebarProps) => {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);

    const [mode, setMode] = useState<SidebarMode>("login");
    const [registerStep, setRegisterStep] = useState<RegisterStep>("email");
    const [registerEmail, setRegisterEmail] = useState("");

    // --- Mutations ---
    const loginMutation = useLoginMutation();
    const checkEmailMutation = useCheckEmailMutation();
    const sendOtpMutation = useSendOtpMutation();
    const verifyOtpMutation = useVerifyOtpMutation();
    const registerMutation = useRegisterMutation();

    // --- Login handler ---
    const handleLogin = useCallback(
        (data: { email: string; password: string }) => {
            loginMutation.mutate(data, {
                onSuccess: (response) => {
                    alert("Login successful!");
                    onClose();
                    navigate(roleRedirectMap[response.user.role], {
                        replace: true,
                    });
                },
            });
        },
        [loginMutation, navigate, onClose],
    );

    // --- Register step handlers ---
    const handleCheckEmailAndSendOtp = useCallback(
        (email: string) => {
            // First check if email exists
            checkEmailMutation.mutate(
                { email },
                {
                    onSuccess: (response) => {
                        if (response.exists) {
                            // Email already registered - suggest login
                            alert(
                                "This email is already registered. Please login instead.",
                            );
                            setMode("login");
                        } else {
                            // Email available - send OTP
                            sendOtpMutation.mutate(
                                { email },
                                {
                                    onSuccess: () => {
                                        alert("OTP sent! Check your email.");
                                        setRegisterEmail(email);
                                        setRegisterStep("verifyOtp");
                                    },
                                },
                            );
                        }
                    },
                },
            );
        },
        [checkEmailMutation, sendOtpMutation],
    );

    const handleVerifyOtp = useCallback(
        (code: string) => {
            verifyOtpMutation.mutate(
                { email: registerEmail, code },
                {
                    onSuccess: () => {
                        alert("OTP verified!");
                        setRegisterStep("completeProfile");
                    },
                },
            );
        },
        [verifyOtpMutation, registerEmail],
    );

    const handleRegister = useCallback(
        (data: {
            name: string;
            email: string;
            password: string;
            phoneNumber: string;
        }) => {
            registerMutation.mutate(data, {
                onSuccess: () => {
                    alert("Registration successful!");
                    onClose();
                    navigate("/app/dashboard", { replace: true });
                },
            });
        },
        [registerMutation, navigate, onClose],
    );

    // --- Mode switch helpers ---
    const switchToRegister = useCallback(
        (prefillEmail?: string) => {
            setMode("register");
            setRegisterStep("email");
            setRegisterEmail(prefillEmail || "");
            loginMutation.reset();
            checkEmailMutation.reset();
        },
        [loginMutation, checkEmailMutation],
    );

    const switchToLogin = useCallback(() => {
        setMode("login");
        setRegisterStep("email");
        setRegisterEmail("");
        checkEmailMutation.reset();
        sendOtpMutation.reset();
        verifyOtpMutation.reset();
        registerMutation.reset();
    }, [
        checkEmailMutation,
        sendOtpMutation,
        verifyOtpMutation,
        registerMutation,
    ]);

    if (!isOpen) return null;

    // If already authenticated, don't show sidebar
    if (token) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

            {/* Sidebar Panel */}
            <div className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white p-6 shadow-lg">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        {mode === "login" ? "Sign In" : "Create Account"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {mode === "login" && (
                        <LoginForm
                            onSubmit={handleLogin}
                            isPending={loginMutation.isPending}
                            error={loginMutation.error}
                            onSwitchToRegister={switchToRegister}
                        />
                    )}

                    {mode === "register" && registerStep === "email" && (
                        <RegisterStep1
                            onSubmit={handleCheckEmailAndSendOtp}
                            isPending={
                                checkEmailMutation.isPending ||
                                sendOtpMutation.isPending
                            }
                            error={
                                checkEmailMutation.error ||
                                sendOtpMutation.error
                            }
                            onSwitchToLogin={switchToLogin}
                            prefillEmail={registerEmail}
                        />
                    )}

                    {mode === "register" && registerStep === "verifyOtp" && (
                        <RegisterStep2
                            onSubmit={handleVerifyOtp}
                            isPending={verifyOtpMutation.isPending}
                            error={verifyOtpMutation.error}
                            email={registerEmail}
                        />
                    )}

                    {mode === "register" &&
                        registerStep === "completeProfile" && (
                            <RegisterStep3
                                onSubmit={handleRegister}
                                isPending={registerMutation.isPending}
                                error={registerMutation.error}
                                email={registerEmail}
                            />
                        )}
                </div>
            </div>
        </>
    );
});

AuthSidebar.displayName = "AuthSidebar";

export default AuthSidebar;
