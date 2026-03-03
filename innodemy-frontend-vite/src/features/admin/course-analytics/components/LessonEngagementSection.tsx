import type { ModuleLessonEngagement } from "../types";

interface LessonEngagementSectionProps {
    modules: ModuleLessonEngagement[];
}

const LessonEngagementSection = ({ modules }: LessonEngagementSectionProps) => {
    return (
        <div className="space-y-4">
            {modules.map((module) => (
                <div
                    key={module.moduleId}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                >
                    <h3 className="mb-3 text-base font-semibold text-gray-900">
                        {module.moduleTitle}
                    </h3>

                    <div className="space-y-3">
                        {module.lessons.map((lesson) => {
                            const clampedRate = Math.min(
                                100,
                                Math.max(0, lesson.completionRate),
                            );
                            const isWarning = clampedRate >= 40 && clampedRate < 70;
                            const isCritical = clampedRate < 40;
                            const fillClass = isCritical
                                ? "bg-red-500"
                                : isWarning
                                  ? "bg-amber-500"
                                  : "bg-black";
                            const textClass = isCritical
                                ? "text-red-700"
                                : isWarning
                                  ? "text-amber-700"
                                  : "text-gray-700";

                            return (
                                <div
                                    key={lesson.lessonId}
                                    className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_200px_72px]"
                                >
                                    <p className="text-sm text-gray-800">
                                        {lesson.title}
                                    </p>

                                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                                        <div
                                            className={`h-2.5 rounded-full ${fillClass}`}
                                            style={{
                                                width: `${clampedRate}%`,
                                            }}
                                        />
                                    </div>

                                    <p
                                        className={`text-right text-sm font-medium ${textClass}`}
                                    >
                                        {isCritical && <span>⚠ </span>}
                                        {lesson.completionRate}%
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LessonEngagementSection;
