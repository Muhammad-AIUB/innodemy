import type { Course } from "../../courses/types";

interface CompletedCourseCardProps {
    course: Course;
    onReviewCourse: () => void;
    onViewCertificate: () => void;
}

const CompletedCourseCard = ({
    course,
    onReviewCourse,
    onViewCertificate,
}: CompletedCourseCardProps) => {
    return (
        <div className="rounded border p-4">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="mt-2 inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Completed
            </p>
            <div>
                <button
                    type="button"
                    onClick={onReviewCourse}
                    className="mt-4 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                >
                    Review Course
                </button>
                <button
                    type="button"
                    onClick={onViewCertificate}
                    className="mt-2 rounded bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    View Certificate
                </button>
            </div>
        </div>
    );
};

export default CompletedCourseCard;
