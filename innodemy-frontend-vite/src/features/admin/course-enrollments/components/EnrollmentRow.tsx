import { Link } from "react-router-dom";
import CourseProgressBar from "./CourseProgressBar";
import type { LearnerStatus } from "../utils/getLearnerStatus";

interface EnrollmentRowProps {
    courseId: string;
    userId: string;
    selected: boolean;
    onToggle: (userId: string) => void;
    name: string;
    email: string;
    enrolledAt: string;
    progressPercentage: number;
    status: LearnerStatus;
}

const EnrollmentRow = ({
    courseId,
    userId,
    selected,
    onToggle,
    name,
    email,
    enrolledAt,
    progressPercentage,
    status,
}: EnrollmentRowProps) => {
    const statusBadge =
        status === "completed"
            ? {
                  label: "Completed",
                  className: "bg-green-50 text-green-700",
              }
            : status === "at-risk"
              ? {
                    label: "At Risk",
                    className: "bg-yellow-50 text-yellow-700",
                }
              : status === "not-started"
                ? {
                      label: "Not Started",
                      className: "bg-gray-100 text-gray-700",
                  }
                : null;

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(userId)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    aria-label={`Select learner ${name}`}
                />
            </td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                <div className="flex items-center gap-2">
                    <span>{name}</span>
                    {statusBadge && (
                        <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${statusBadge.className}`}
                        >
                            {statusBadge.label}
                        </span>
                    )}
                    <Link
                        to={`/admin/courses/${courseId}/students/${userId}`}
                        className="rounded bg-gray-900 px-2 py-0.5 text-xs font-medium text-white hover:bg-gray-800"
                    >
                        View Progress
                    </Link>
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">{email}</td>
            <td className="px-4 py-3 text-sm text-gray-500">{enrolledAt}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-36">
                        <CourseProgressBar percentage={progressPercentage} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                        {progressPercentage}%
                    </span>
                </div>
            </td>
        </tr>
    );
};

export default EnrollmentRow;
