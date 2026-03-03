import { useApiError } from "../../../../hooks/useApiError";
import { usePublicCoursesQuery } from "../hooks";
import PublicCourseSection from "../components/PublicCourseSection";

const PublicCoursesPage = () => {
    const {
        data: courses,
        isLoading,
        isError,
        error,
    } = usePublicCoursesQuery();
    const { getErrorMessage } = useApiError();

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {getErrorMessage(error)}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8">
                <h1 className="mb-2 text-4xl font-bold text-gray-900">
                    Explore Our Courses
                </h1>
                <p className="text-lg text-gray-600">
                    Discover high-quality courses to advance your skills
                </p>
            </div>

            <PublicCourseSection
                title="Available Courses"
                courses={courses || []}
                emptyMessage="No courses available at the moment. Check back soon!"
            />
        </div>
    );
};

export default PublicCoursesPage;
