import type { ModuleProgress } from "../types";

interface ModuleProgressCardProps {
    module: ModuleProgress;
}

const ModuleProgressCard = ({ module }: ModuleProgressCardProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-base font-semibold text-gray-900">
                {module.title}
            </h2>
            <ul className="mt-3 space-y-2">
                {module.lessons.map((lesson) => (
                    <li
                        key={lesson.lessonId}
                        className="text-sm text-gray-700"
                    >
                        {lesson.completed ? "✓" : "○"} {lesson.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModuleProgressCard;
