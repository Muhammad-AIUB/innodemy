import type { CourseDetail } from "../types";
import type { CourseProgressResponse } from "../../progress/types";
import CourseProgressBar from "../../progress/components/CourseProgressBar";
import isCourseCompleted from "../../progress/utils/isCourseCompleted";
import getImageUrl from "../../../shared/utils/getImageUrl";

interface CourseHeroProps {
    course: CourseDetail;
    onStartLearning: () => void;
    isStartingDisabled: boolean;
    isResolvingResume: boolean;
    progress?: CourseProgressResponse;
    isEnrolled: boolean;
}

const CourseHero = ({
    course,
    onStartLearning,
    isStartingDisabled,
    isResolvingResume,
    progress,
    isEnrolled,
}: CourseHeroProps) => {
    const courseCompleted = isCourseCompleted(progress);

    return (
        <div className="rounded border p-6">
            {course.bannerImage && (
                <img
                    src={getImageUrl(course.bannerImage)}
                    alt={course.title}
                    className="mb-4 h-56 w-full rounded object-cover"
                />
            )}
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="mt-2 text-gray-600">{course.description}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{course.duration} weeks</span>
                <span>{course.totalModules} modules</span>
                <span>{course.totalProjects} projects</span>
                <span>{course.totalLive} live classes</span>
            </div>

            <div className="mt-4">
                {course.discountPrice != null ? (
                    <>
                        <span className="text-lg line-through">
                            ৳{course.price}
                        </span>{" "}
                        <span className="text-xl font-bold">
                            ৳{course.discountPrice}
                        </span>
                    </>
                ) : (
                    <span className="text-xl font-bold">৳{course.price}</span>
                )}
            </div>

            {progress && (
                <div className="mt-4">
                    <CourseProgressBar percentage={progress.percentage} />
                    <p className="mt-1 text-sm text-gray-600">
                        {Math.min(100, Math.max(0, progress.percentage))}%
                        complete ({progress.completedLessons} /{" "}
                        {progress.totalLessons} lessons)
                    </p>
                    {courseCompleted && (
                        <p className="mt-1 text-sm font-medium text-green-700">
                            Course completed
                        </p>
                    )}
                </div>
            )}

            {isEnrolled && (
                <button
                    type="button"
                    onClick={onStartLearning}
                    disabled={isStartingDisabled || courseCompleted}
                    className="mt-4 rounded bg-black px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {courseCompleted
                        ? "Course Completed 🎉"
                        : isResolvingResume
                          ? "Loading..."
                          : progress && progress.completedLessons > 0
                            ? "Continue Learning"
                            : "Start Learning"}
                </button>
            )}
        </div>
    );
};

export default CourseHero;
