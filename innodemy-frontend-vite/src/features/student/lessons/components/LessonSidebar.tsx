import { Link } from "react-router-dom";
import type { CourseModule } from "../types";

interface LessonSidebarProps {
    modules: CourseModule[];
    courseId: string;
    activeLessonId: string;
    completedLessonIds: string[];
}

const LessonSidebar = ({
    modules,
    courseId,
    activeLessonId,
    completedLessonIds,
}: LessonSidebarProps) => {
    return (
        <aside className="w-72 shrink-0 overflow-y-auto border-r p-4">
            <h2 className="mb-4 text-lg font-bold">Lessons</h2>
            {modules.map((mod) => (
                <div key={mod.id} className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-500">
                        {mod.title}
                    </h3>
                    <ul className="space-y-1">
                        {mod.lessons.map((lesson) => {
                            const isCompleted = completedLessonIds.includes(
                                lesson.id,
                            );

                            return (
                                <li key={lesson.id}>
                                    <Link
                                        to={`/app/courses/${courseId}/lessons/${lesson.id}`}
                                        className={`block rounded px-3 py-2 text-sm ${
                                            lesson.id === activeLessonId
                                                ? "bg-black text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {isCompleted && (
                                            <span className="mr-1">✓</span>
                                        )}
                                        {lesson.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </aside>
    );
};

export default LessonSidebar;
