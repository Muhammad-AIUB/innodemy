import { useParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import CourseProgressBar from "../components/CourseProgressBar";
import ModuleProgressCard from "../components/ModuleProgressCard";
import { useStudentCourseProgressQuery } from "../hooks";

const AdminStudentProgressPage = () => {
    const { courseId, userId } = useParams<{
        courseId: string;
        userId: string;
    }>();
    const safeCourseId = courseId ?? "";
    const safeUserId = userId ?? "";
    const { getErrorMessage } = useApiError();

    const { data, isLoading, isError, error } = useStudentCourseProgressQuery(
        safeCourseId,
        safeUserId,
    );

    if (isLoading) {
        return <p>Loading student progress...</p>;
    }

    if (isError) {
        return <p className="text-red-600">{getErrorMessage(error)}</p>;
    }

    if (!data) {
        return <p className="text-gray-500">Student progress not found.</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">
                Student Progress
            </h1>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-base font-semibold text-gray-900">
                    {data.name || "Unnamed Learner"}
                </p>
                <p className="mt-1 text-sm text-gray-600">{data.email}</p>

                <div className="mt-4 flex items-center gap-3">
                    <div className="w-48">
                        <CourseProgressBar percentage={data.progressPercentage} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                        {data.progressPercentage}%
                    </span>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                    {data.completedLessons} of {data.totalLessons} lessons
                    completed
                </p>
            </div>

            <div className="mt-6 space-y-4">
                {data.modules.map((module) => (
                    <ModuleProgressCard key={module.moduleId} module={module} />
                ))}
            </div>
        </div>
    );
};

export default AdminStudentProgressPage;
