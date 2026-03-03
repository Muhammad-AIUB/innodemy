export interface CreateWebinarRegistrationPayload {
    webinarId: string;
    name: string;
    email: string;
    phone: string;
}

export interface WebinarRegistration {
    id: string;
    webinarId: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}
