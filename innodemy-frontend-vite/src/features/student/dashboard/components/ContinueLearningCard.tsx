import type { Course } from "../../courses/types";
import type { CourseProgressResponse } from "../../progress/types";
import CourseProgressBar from "../../progress/components/CourseProgressBar";

interface ContinueLearningCardProps {
    course: Course;
    progress: CourseProgressResponse;
    onContinueLearning: () => void;
}

const ContinueLearningCard = ({
    course,
    progress,
    onContinueLearning,
}: ContinueLearningCardProps) => {
    const clampedPercentage = Math.min(100, Math.max(0, progress.percentage));

    return (
        <div className="rounded border p-4">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <div className="mt-3">
                <CourseProgressBar percentage={clampedPercentage} />
                <p className="mt-1 text-sm text-gray-600">
                    {clampedPercentage}% complete ({progress.completedLessons} /{" "}
                    {progress.totalLessons} lessons)
                </p>
            </div>
            <button
                type="button"
                onClick={onContinueLearning}
                className="mt-4 rounded bg-black px-4 py-2 text-sm font-medium text-white"
            >
                Continue Learning
            </button>
        </div>
    );
};

export default ContinueLearningCard;
