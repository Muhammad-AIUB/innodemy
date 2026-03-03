import type { StudentEnrollment } from "../types";

const isEnrolledInCourse = (
    courseId: string,
    enrollments: StudentEnrollment[] | undefined,
): boolean => {
    if (!enrollments) return false;
    return enrollments.some((e) => e.courseId === courseId);
};

export default isEnrolledInCourse;
