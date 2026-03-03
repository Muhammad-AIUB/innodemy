import type { PublicCourse } from "../types";
import PublicCourseCard from "./PublicCourseCard";

interface PublicCourseSectionProps {
    title: string;
    courses: PublicCourse[];
    emptyMessage: string;
}

const PublicCourseSection = ({
    title,
    courses,
    emptyMessage,
}: PublicCourseSectionProps) => {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                {title}
            </h2>
            {courses.length === 0 ? (
                <p className="text-gray-500">{emptyMessage}</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <PublicCourseCard key={course.slug} course={course} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PublicCourseSection;
