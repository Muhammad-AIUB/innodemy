import type { EnrollmentRequestStatus } from "../../student/enrollment-requests/types";

export interface AdminEnrollmentRequest {
    id: string;
    courseId: string;
    userId: string;
    paymentMethod: string;
    transactionId: string;
    screenshotUrl: string;
    status: EnrollmentRequestStatus;
    adminNote: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
    course: {
        id: string;
        title: string;
    };
}
