import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import {
    usePublicCourseDetailQuery,
    usePublicCourseSectionsQuery,
} from "../hooks";
import { useAuthStore } from "../../../../stores/authStore";
import SectionRenderer from "../components/SectionRenderer";

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const PublicCourseDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        data: course,
        isLoading,
        isError,
        error,
    } = usePublicCourseDetailQuery(slug ?? "");
    const { getErrorMessage } = useApiError();
    const [showEnrollMessage, setShowEnrollMessage] = useState(false);

    // Fetch dynamic public sections once we have the course id
    const { data: sections } = usePublicCourseSectionsQuery(course?.id ?? "");

    const handleEnrollClick = () => {
        if (!user) {
            // Redirect to login/landing page
            navigate("/", { state: { from: `/courses/${slug}` } });
        } else {
            // Show message to contact admin (or future enrollment feature)
            setShowEnrollMessage(true);
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {getErrorMessage(error)}
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="mx-auto max-w-5xl px-6 py-12">
                <p className="text-red-600">Course not found.</p>
            </div>
        );
    }

    const hasDiscount =
        course.discountPrice !== null && course.discountPrice < course.price;
    const displayPrice = hasDiscount ? course.discountPrice! : course.price;

    return (
        <div className="mx-auto max-w-5xl px-6 py-12">
            {/* Banner Image */}
            {course.bannerImage && (
                <img
                    src={course.bannerImage}
                    alt={course.title}
                    className="mb-8 h-96 w-full rounded-lg object-cover shadow-lg"
                />
            )}

            {/* Course Header */}
            <div className="mb-8">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    {course.title}
                </h1>
                <p className="mb-4 text-lg text-gray-700">
                    {course.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                    {hasDiscount ? (
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-blue-600">
                                {formatPrice(displayPrice)}
                            </span>
                            <span className="text-xl text-gray-400 line-through">
                                {formatPrice(course.price)}
                            </span>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                Save{" "}
                                {Math.round(
                                    ((course.price - course.discountPrice!) /
                                        course.price) *
                                        100,
                                )}
                                %
                            </span>
                        </div>
                    ) : (
                        <span className="text-3xl font-bold text-blue-600">
                            {formatPrice(displayPrice)}
                        </span>
                    )}
                </div>
            </div>

            {/* Course Info Grid */}
            <div className="mb-8 grid gap-6 rounded-lg bg-gray-50 p-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Duration
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {course.duration} hours
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Modules</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {course.totalModules} modules
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Projects
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {course.totalProjects} projects
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Live Sessions
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {course.totalLive} sessions
                    </p>
                </div>
            </div>

            {/* Course Schedule */}
            <div className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                    Course Schedule
                </h2>
                <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                            Start Date:
                        </span>
                        <span className="text-gray-900">
                            {formatDate(course.startDate)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                            Class Days:
                        </span>
                        <span className="text-gray-900">
                            {course.classDays}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                            Class Time:
                        </span>
                        <span className="text-gray-900">
                            {course.classTime}
                        </span>
                    </div>
                </div>
            </div>

            {/* Dynamic Public Sections */}
            {sections && sections.length > 0 && (
                <div className="mb-8 space-y-2">
                    {sections.map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                    ))}
                </div>
            )}

            {/* Enrollment Message */}
            {showEnrollMessage && (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
                    <p className="text-sm">
                        To enroll in this course, please contact the
                        administrator or check back later for enrollment
                        options.
                    </p>
                </div>
            )}

            {/* Enroll Button */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={handleEnrollClick}
                    className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Enroll Now
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/courses")}
                    className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Back to Courses
                </button>
            </div>
        </div>
    );
};

export default PublicCourseDetailPage;
