import { useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCoursesQuery } from "../features/student/courses/hooks";
import type { CourseModule } from "../features/student/lessons/types";
import type { CourseProgressResponse } from "../features/student/progress/types";
import getGlobalResumeTarget from "../features/student/progress/utils/getGlobalResumeTarget";

const StudentLayout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data } = useCoursesQuery();

    const handleContinueLearning = useCallback(() => {
        const courses = data?.data ?? [];

        const target = getGlobalResumeTarget(
            courses,
            (courseId) =>
                queryClient.getQueryData<CourseProgressResponse>([
                    "progress",
                    courseId,
                ]),
            (courseId) =>
                queryClient.getQueryData<CourseModule[]>(["modules", courseId]),
        );

        if (!target) {
            navigate("/app/dashboard");
            return;
        }

        navigate(`/app/courses/${target.courseId}/lessons/${target.lessonId}`);
    }, [data, navigate, queryClient]);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-white">
                <div className="p-4 text-lg font-bold">Innodemy</div>
                <nav className="p-4">
                    {/* Student navigation will be added here */}
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b bg-white px-6">
                    <span className="text-sm">Student Portal</span>
                    <button
                        type="button"
                        onClick={handleContinueLearning}
                        className="rounded bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Continue Learning
                    </button>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
