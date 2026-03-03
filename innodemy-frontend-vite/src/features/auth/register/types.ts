export interface SendOtpPayload {
    email: string;
}

export interface SendOtpResponse {
    message: string;
}

export interface CheckEmailPayload {
    email: string;
}

export interface CheckEmailResponse {
    exists: boolean;
}

export interface VerifyOtpPayload {
    email: string;
    code: string;
}

export interface VerifyOtpResponse {
    message: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export type RegisterStep = "email" | "verifyOtp" | "completeProfile";
