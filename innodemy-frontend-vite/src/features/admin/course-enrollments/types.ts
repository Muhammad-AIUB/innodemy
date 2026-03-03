export interface CourseEnrollment {
    userId: string;
    name: string;
    email: string;
    enrolledAt: string;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
}
