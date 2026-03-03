import { Link, useLocation, useParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import AnalyticsCard from "../components/AnalyticsCard";
import LessonEngagementSection from "../components/LessonEngagementSection";
import {
    useCourseAnalyticsQuery,
    useCourseLessonEngagementQuery,
} from "../hooks";

interface CourseAnalyticsLocationState {
    courseTitle?: string;
}

const AdminCourseAnalyticsPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const location = useLocation();
    const state = location.state as CourseAnalyticsLocationState | null;
    const safeCourseId = courseId ?? "";
    const courseTitle = state?.courseTitle;
    const { getErrorMessage } = useApiError();

    const {
        data: analyticsData,
        isLoading: isAnalyticsLoading,
        isError: isAnalyticsError,
        error: analyticsError,
    } = useCourseAnalyticsQuery(safeCourseId);
    const {
        data: lessonEngagementData,
        isLoading: isLessonEngagementLoading,
        isError: isLessonEngagementError,
        error: lessonEngagementError,
    } = useCourseLessonEngagementQuery(safeCourseId);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Course Analytics
                </h1>
                <Link
                    to={`/admin/courses/${safeCourseId}/enrollments`}
                    state={{ courseTitle }}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    View Learners
                </Link>
            </div>

            {isAnalyticsLoading && <p>Loading analytics...</p>}

            {isAnalyticsError && (
                <p className="text-red-600">{getErrorMessage(analyticsError)}</p>
            )}

            {analyticsData && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <AnalyticsCard
                        label="Enrolled Students"
                        value={analyticsData.enrolledStudents}
                    />
                    <AnalyticsCard
                        label="Started Learning"
                        value={analyticsData.startedStudents}
                    />
                    <AnalyticsCard
                        label="Completed Students"
                        value={analyticsData.completedStudents}
                    />
                    <AnalyticsCard
                        label="Completion Rate (%)"
                        value={analyticsData.completionRate}
                    />
                </div>
            )}

            <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Lesson Engagement
                </h2>

                {isLessonEngagementLoading && (
                    <p>Loading lesson engagement...</p>
                )}

                {isLessonEngagementError && (
                    <p className="text-red-600">
                        {getErrorMessage(lessonEngagementError)}
                    </p>
                )}

                {lessonEngagementData && lessonEngagementData.length === 0 && (
                    <p className="text-gray-500">
                        No lesson engagement data available.
                    </p>
                )}

                {lessonEngagementData && lessonEngagementData.length > 0 && (
                    <LessonEngagementSection modules={lessonEngagementData} />
                )}
            </div>
        </div>
    );
};

export default AdminCourseAnalyticsPage;
