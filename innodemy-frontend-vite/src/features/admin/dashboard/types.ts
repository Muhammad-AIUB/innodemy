export interface DashboardStats {
    users: {
        total: number;
        students: number;
        admins: number;
    };
    courses: {
        total: number;
        published: number;
        draft: number;
    };
    enrollments: {
        total: number;
        active: number;
    };
    blogs: {
        total: number;
        published: number;
    };
    webinars: {
        total: number;
        published: number;
        registrations: number;
    };
    enrollmentRequests: {
        pending: number;
        approved: number;
        rejected: number;
    };
    content: {
        modules: number;
        lessons: number;
    };
    recentUsers: RecentUser[];
    recentEnrollments: RecentEnrollment[];
}

export interface RecentUser {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface RecentEnrollment {
    id: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    course: {
        id: string;
        title: string;
    };
}
