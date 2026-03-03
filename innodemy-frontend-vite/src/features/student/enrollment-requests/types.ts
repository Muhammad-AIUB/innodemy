export type EnrollmentRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EnrollmentRequest {
    id: string;
    courseId: string;
    userId: string;
    paymentMethod: string;
    transactionId: string;
    screenshotUrl: string;
    status: EnrollmentRequestStatus;
    adminNote?: string;
    createdAt: string;
}

export interface CreateEnrollmentRequestPayload {
    courseId: string;
    paymentMethod: string;
    transactionId: string;
    screenshotUrl?: string;
    screenshotFile?: File;
}
