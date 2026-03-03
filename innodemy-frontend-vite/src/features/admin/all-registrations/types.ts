export interface WebinarRegistrationWithWebinar {
    id: string;
    webinarId: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    webinar: {
        id: string;
        title: string;
        date: string;
        status: string;
    };
}

export interface AllRegistrationsResponse {
    registrations: WebinarRegistrationWithWebinar[];
    total: number;
    page: number;
    limit: number;
}

export interface AllRegistrationsParams {
    page?: number;
    limit?: number;
    search?: string;
    webinarId?: string;
}
