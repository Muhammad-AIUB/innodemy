import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { UserRole } from "../types/auth.types";

// Eager-loaded: landing page (public entry point)
import LandingPage from "../features/auth/pages/LandingPage";
import BlogsPage from "../features/public/blogs/pages/BlogsPage";
import BlogDetailPage from "../features/public/blogs/pages/BlogDetailPage";

// Public course pages
const PublicCoursesPage = lazy(
    () => import("../features/public/courses/pages/PublicCoursesPage"),
);
const PublicCourseDetailPage = lazy(
    () => import("../features/public/courses/pages/PublicCourseDetailPage"),
);

// Lazy-loaded layouts — students never download admin bundles
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const SuperAdminLayout = lazy(() => import("../layouts/SuperAdminLayout"));

// Lazy-loaded placeholder pages
const StudentDashboard = lazy(
    () => import("../features/student/pages/StudentDashboard"),
);
const CoursesPage = lazy(
    () => import("../features/student/courses/pages/CoursesPage"),
);
const CourseDetailPage = lazy(
    () => import("../features/student/courses/pages/CourseDetailPage"),
);
const LessonPage = lazy(
    () => import("../features/student/lessons/pages/LessonPage"),
);
const CourseCertificatePage = lazy(
    () =>
        import("../features/student/certificates/pages/CourseCertificatePage"),
);
const AdminDashboard = lazy(
    () => import("../features/admin/pages/AdminDashboard"),
);
const AdminCoursesPage = lazy(
    () => import("../features/admin/courses/pages/AdminCoursesPage"),
);
const CreateCoursePage = lazy(
    () => import("../features/admin/courses/create/pages/CreateCoursePage"),
);
const EditCoursePage = lazy(
    () => import("../features/admin/courses/edit/pages/EditCoursePage"),
);
const CurriculumBuilderPage = lazy(
    () => import("../features/admin/curriculum/pages/CurriculumBuilderPage"),
);
const AdminCourseAnalyticsPage = lazy(
    () =>
        import("../features/admin/course-analytics/pages/AdminCourseAnalyticsPage"),
);
const AdminCourseEnrollmentsPage = lazy(
    () =>
        import("../features/admin/course-enrollments/pages/AdminCourseEnrollmentsPage"),
);
const AdminStudentProgressPage = lazy(
    () =>
        import("../features/admin/student-progress/pages/AdminStudentProgressPage"),
);
const LessonContentEditorPage = lazy(
    () =>
        import("../features/admin/lesson-content/pages/LessonContentEditorPage"),
);
const AdminEnrollmentRequestsPage = lazy(
    () =>
        import("../features/admin/enrollment-requests/pages/AdminEnrollmentRequestsPage"),
);
// const SuperAdminDashboard = lazy(
//     () => import("../features/admin/pages/SuperAdminDashboard"),
// );
const WebinarsPage = lazy(
    () => import("../features/public/webinars/pages/WebinarsPage"),
);
const WebinarDetailPage = lazy(
    () => import("../features/public/webinars/pages/WebinarDetailPage"),
);
const AdminWebinarsPage = lazy(
    () => import("../features/admin/webinars/pages/AdminWebinarsPage"),
);
const CreateWebinarPage = lazy(
    () => import("../features/admin/webinars/pages/CreateWebinarPage"),
);
const EditWebinarPage = lazy(
    () => import("../features/admin/webinars/pages/EditWebinarPage"),
);
const AdminWebinarRegistrationsPage = lazy(
    () =>
        import("../features/admin/webinar-registrations/pages/AdminWebinarRegistrationsPage"),
);

// Admin Blogs
const AdminBlogsPage = lazy(
    () => import("../features/admin/blogs/pages/AdminBlogsPage"),
);
const CreateBlogPage = lazy(
    () => import("../features/admin/blogs/pages/CreateBlogPage"),
);
const EditBlogPage = lazy(
    () => import("../features/admin/blogs/pages/EditBlogPage"),
);

// Admin Instructors
const InstructorsPage = lazy(
    () => import("../features/admin/instructors/pages/InstructorsPage"),
);
const CreateInstructorPage = lazy(
    () => import("../features/admin/instructors/pages/CreateInstructorPage"),
);
const EditInstructorPage = lazy(
    () => import("../features/admin/instructors/pages/EditInstructorPage"),
);

// Admin Categories
const CategoriesPage = lazy(
    () => import("../features/admin/categories/pages/CategoriesPage"),
);
const CreateCategoryPage = lazy(
    () => import("../features/admin/categories/pages/CreateCategoryPage"),
);
const EditCategoryPage = lazy(
    () => import("../features/admin/categories/pages/EditCategoryPage"),
);

// Admin Course Public Content
const CoursePublicContentPage = lazy(
    () =>
        import("../features/admin/course-public-content/pages/CoursePublicContentPage"),
);

// All Webinar Registrations
const AllWebinarRegistrationsPage = lazy(
    () =>
        import("../features/admin/all-registrations/pages/AllWebinarRegistrationsPage"),
);

// Admin Users (SUPER_ADMIN only)
const AdminUsersPage = lazy(
    () => import("../features/admin/users/pages/AdminUsersPage"),
);

export const router = createBrowserRouter([
    // Public landing page with auth sidebar
    {
        path: "/",
        element: <LandingPage />,
    },

    // Public course pages
    { path: "/courses", element: <PublicCoursesPage /> },
    { path: "/courses/:slug", element: <PublicCourseDetailPage /> },

    // Public webinar pages
    { path: "/webinars", element: <WebinarsPage /> },
    { path: "/webinars/:slug", element: <WebinarDetailPage /> },

    // Public blog pages
    { path: "/blogs", element: <BlogsPage /> },
    { path: "/blogs/:slug", element: <BlogDetailPage /> },

    // Student routes
    {
        path: "/app",
        element: (
            <ProtectedRoute
                allowedRoles={[
                    UserRole.STUDENT,
                    UserRole.ADMIN,
                    UserRole.SUPER_ADMIN,
                ]}
            />
        ),
        children: [
            {
                element: <StudentLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    { path: "dashboard", element: <StudentDashboard /> },
                    { path: "courses", element: <CoursesPage /> },
                    { path: "courses/:slug", element: <CourseDetailPage /> },
                    {
                        path: "courses/:courseId/lessons/:lessonId",
                        element: <LessonPage />,
                    },
                    {
                        path: "courses/:courseId/certificate",
                        element: <CourseCertificatePage />,
                    },
                ],
            },
        ],
    },

    // Admin routes
    {
        path: "/admin",
        element: (
            <ProtectedRoute
                allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
            />
        ),
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    { path: "dashboard", element: <AdminDashboard /> },
                    { path: "courses", element: <AdminCoursesPage /> },
                    {
                        path: "courses/create",
                        element: <CreateCoursePage />,
                    },
                    {
                        path: "courses/:id/edit",
                        element: <EditCoursePage />,
                    },
                    {
                        path: "courses/:id/curriculum",
                        element: <CurriculumBuilderPage />,
                    },
                    {
                        path: "courses/:id/public-content",
                        element: <CoursePublicContentPage />,
                    },
                    {
                        path: "courses/:courseId/analytics",
                        element: <AdminCourseAnalyticsPage />,
                    },
                    {
                        path: "courses/:courseId/enrollments",
                        element: <AdminCourseEnrollmentsPage />,
                    },
                    {
                        path: "courses/:courseId/students/:userId",
                        element: <AdminStudentProgressPage />,
                    },
                    {
                        path: "lessons/:lessonId/content",
                        element: <LessonContentEditorPage />,
                    },
                    {
                        path: "enrollment-requests",
                        element: <AdminEnrollmentRequestsPage />,
                    },
                    {
                        path: "webinars",
                        element: <AdminWebinarsPage />,
                    },
                    {
                        path: "webinars/create",
                        element: <CreateWebinarPage />,
                    },
                    {
                        path: "webinars/:id/edit",
                        element: <EditWebinarPage />,
                    },
                    {
                        path: "webinars/:webinarId/registrations",
                        element: <AdminWebinarRegistrationsPage />,
                    },
                    {
                        path: "blogs",
                        element: <AdminBlogsPage />,
                    },
                    {
                        path: "blogs/create",
                        element: <CreateBlogPage />,
                    },
                    {
                        path: "blogs/:id/edit",
                        element: <EditBlogPage />,
                    },
                    {
                        path: "instructors",
                        element: <InstructorsPage />,
                    },
                    {
                        path: "instructors/create",
                        element: <CreateInstructorPage />,
                    },
                    {
                        path: "instructors/:id/edit",
                        element: <EditInstructorPage />,
                    },
                    {
                        path: "categories",
                        element: <CategoriesPage />,
                    },
                    {
                        path: "categories/create",
                        element: <CreateCategoryPage />,
                    },
                    {
                        path: "categories/:id/edit",
                        element: <EditCategoryPage />,
                    },
                    {
                        path: "webinar-registrations",
                        element: <AllWebinarRegistrationsPage />,
                    },
                    {
                        path: "users",
                        element: <AdminUsersPage />,
                    },
                ],
            },
        ],
    },

    // Super Admin routes
    {
        path: "/super-admin",
        element: <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]} />,
        children: [
            {
                element: <SuperAdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    { path: "dashboard", element: <AdminDashboard /> },
                    { path: "courses", element: <AdminCoursesPage /> },
                    {
                        path: "courses/create",
                        element: <CreateCoursePage />,
                    },
                    {
                        path: "courses/:id/edit",
                        element: <EditCoursePage />,
                    },
                    {
                        path: "courses/:id/curriculum",
                        element: <CurriculumBuilderPage />,
                    },
                    {
                        path: "courses/:id/public-content",
                        element: <CoursePublicContentPage />,
                    },
                    {
                        path: "courses/:courseId/analytics",
                        element: <AdminCourseAnalyticsPage />,
                    },
                    {
                        path: "courses/:courseId/enrollments",
                        element: <AdminCourseEnrollmentsPage />,
                    },
                    {
                        path: "courses/:courseId/students/:userId",
                        element: <AdminStudentProgressPage />,
                    },
                    {
                        path: "lessons/:lessonId/content",
                        element: <LessonContentEditorPage />,
                    },
                    {
                        path: "enrollment-requests",
                        element: <AdminEnrollmentRequestsPage />,
                    },
                    {
                        path: "webinars",
                        element: <AdminWebinarsPage />,
                    },
                    {
                        path: "webinars/create",
                        element: <CreateWebinarPage />,
                    },
                    {
                        path: "webinars/:id/edit",
                        element: <EditWebinarPage />,
                    },
                    {
                        path: "webinars/:webinarId/registrations",
                        element: <AdminWebinarRegistrationsPage />,
                    },
                    {
                        path: "blogs",
                        element: <AdminBlogsPage />,
                    },
                    {
                        path: "blogs/create",
                        element: <CreateBlogPage />,
                    },
                    {
                        path: "blogs/:id/edit",
                        element: <EditBlogPage />,
                    },
                    {
                        path: "webinar-registrations",
                        element: <AllWebinarRegistrationsPage />,
                    },
                    {
                        path: "users",
                        element: <AdminUsersPage />,
                    },
                ],
            },
        ],
    },

    // Catch-all redirect
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
