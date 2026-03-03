import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../../stores/authStore";
import { useCourseDetailQuery, useCoursesQuery } from "../../courses/hooks";
import { useCourseProgressQuery } from "../../progress/hooks";
import isCourseCompleted from "../../progress/utils/isCourseCompleted";
import CertificatePreview from "../components/CertificatePreview";

const CourseCertificatePage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const safeCourseId = courseId ?? "";
    const studentName = useAuthStore((state) => state.user?.name ?? "Student");

    const {
        data: coursesResponse,
        isLoading: coursesLoading,
        isError: coursesError,
    } = useCoursesQuery();

    const courseMeta = useMemo(() => {
        const courses = coursesResponse?.data ?? [];
        return courses.find((course) => course.id === safeCourseId) ?? null;
    }, [coursesResponse, safeCourseId]);

    const {
        data: course,
        isLoading: courseLoading,
        isError: courseError,
    } = useCourseDetailQuery(courseMeta?.slug ?? "");

    const {
        data: progress,
        isLoading: progressLoading,
        isError: progressError,
    } = useCourseProgressQuery(safeCourseId);

    if (!safeCourseId) {
        return <Navigate to="/app/dashboard" replace />;
    }

    if (coursesLoading || courseLoading || progressLoading) {
        return <p>Loading certificate...</p>;
    }

    if (!courseMeta) {
        return <Navigate to="/app/dashboard" replace />;
    }

    if (coursesError || courseError || progressError || !course) {
        return <p className="text-red-600">Failed to load certificate.</p>;
    }

    if (!progress || !isCourseCompleted(progress)) {
        return <Navigate to={`/app/courses/${course.slug}`} replace />;
    }

    const handleDownload = () => {
        // TODO: Replace print flow with backend PDF certificate endpoint.
        window.print();
    };

    return (
        <CertificatePreview
            platformName="Innodemy"
            studentName={studentName}
            courseTitle={course.title}
            onDownload={handleDownload}
        />
    );
};

export default CourseCertificatePage;
