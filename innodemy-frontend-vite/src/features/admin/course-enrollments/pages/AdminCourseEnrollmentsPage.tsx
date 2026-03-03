import { useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import EnrollmentRow from "../components/EnrollmentRow";
import { useCourseEnrollmentsQuery } from "../hooks";
import { exportEnrollmentsCsv } from "../utils/exportEnrollmentsCsv";
import { getLearnerStatus } from "../utils/getLearnerStatus";

type FilterMode = "all" | "at-risk" | "completed" | "not-started";
interface CourseEnrollmentsLocationState {
    courseTitle?: string;
}

const FILTER_TABS: { label: string; value: FilterMode }[] = [
    { label: "All", value: "all" },
    { label: "At Risk", value: "at-risk" },
    { label: "Completed", value: "completed" },
    { label: "Not Started", value: "not-started" },
];

const EMPTY_MESSAGES: Record<FilterMode, string> = {
    all: "No learners found.",
    "at-risk": "No at-risk learners 🎉",
    completed: "No completed learners yet",
    "not-started": "No not-started learners",
};

const isFilterMode = (value: string | null): value is FilterMode => {
    return (
        value === "all" ||
        value === "at-risk" ||
        value === "completed" ||
        value === "not-started"
    );
};

const AdminCourseEnrollmentsPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const location = useLocation();
    const state = location.state as CourseEnrollmentsLocationState | null;
    const [searchParams, setSearchParams] = useSearchParams();
    const safeCourseId = courseId ?? "";
    const courseTitle =
        state?.courseTitle?.trim() ||
        (safeCourseId ? `Course ${safeCourseId}` : "Course");
    const { getErrorMessage } = useApiError();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const filterMode = useMemo<FilterMode>(() => {
        const filterParam = searchParams.get("filter");
        return isFilterMode(filterParam) ? filterParam : "all";
    }, [searchParams]);

    const { data, isLoading, isError, error } =
        useCourseEnrollmentsQuery(safeCourseId);

    const sortedEnrollmentsWithStatus = useMemo(() => {
        if (!data) return [];

        return [...data].sort(
            (a, b) => b.progressPercentage - a.progressPercentage,
        ).map((enrollment) => ({
            enrollment,
            status: getLearnerStatus(
                enrollment.progressPercentage,
                enrollment.enrolledAt,
            ),
        }));
    }, [data]);

    const filteredEnrollments = useMemo(() => {
        if (filterMode === "all") {
            return sortedEnrollmentsWithStatus;
        }

        return sortedEnrollmentsWithStatus.filter(
            (item) => item.status === filterMode,
        );
    }, [sortedEnrollmentsWithStatus, filterMode]);

    const filteredUserIds = useMemo(
        () => filteredEnrollments.map(({ enrollment }) => enrollment.userId),
        [filteredEnrollments],
    );
    const selectedEnrollments = useMemo(() => {
        if (!data || selectedIds.size === 0) {
            return [];
        }

        return data.filter((enrollment) => selectedIds.has(enrollment.userId));
    }, [data, selectedIds]);

    const allFilteredSelected =
        filteredUserIds.length > 0 &&
        filteredUserIds.every((userId) => selectedIds.has(userId));

    const toggleSelection = (userId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }

            return next;
        });
    };

    const toggleSelectAllFiltered = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (allFilteredSelected) {
                filteredUserIds.forEach((userId) => next.delete(userId));
            } else {
                filteredUserIds.forEach((userId) => next.add(userId));
            }

            return next;
        });
    };

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    const handleExportSelected = () => {
        if (selectedEnrollments.length === 0) {
            return;
        }

        exportEnrollmentsCsv(selectedEnrollments, {
            courseTitle,
            filterMode,
        });
    };

    const handleFilterChange = (nextFilter: FilterMode) => {
        if (searchParams.get("filter") === nextFilter) {
            return;
        }

        setSearchParams({ filter: nextFilter });
    };

    if (isLoading) {
        return <p>Loading learners...</p>;
    }

    if (isError) {
        return <p className="text-red-600">{getErrorMessage(error)}</p>;
    }

    if (!data || data.length === 0) {
        return <p className="text-gray-500">No active learners enrolled.</p>;
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Course Learners
            </h1>

            <div className="mb-4 flex gap-2">
                {FILTER_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => handleFilterChange(tab.value)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            filterMode === tab.value
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {selectedIds.size > 0 && (
                <div className="sticky top-0 z-10 mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm font-medium text-gray-900">
                        {selectedIds.size} learners selected
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled
                            className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 disabled:cursor-not-allowed"
                        >
                            Send Reminder
                        </button>
                        <button
                            type="button"
                            disabled={selectedIds.size === 0}
                            onClick={handleExportSelected}
                            className="rounded-md px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 enabled:bg-gray-900 enabled:text-white enabled:hover:bg-gray-800"
                        >
                            Export
                        </button>
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}

            {filteredEnrollments.length === 0 ? (
                <p className="text-gray-500">{EMPTY_MESSAGES[filterMode]}</p>
            ) : (
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b border-gray-300 text-left text-sm font-medium text-gray-600">
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={allFilteredSelected}
                                    onChange={toggleSelectAllFiltered}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                    aria-label="Select all filtered learners"
                                />
                            </th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Enrolled At</th>
                            <th className="px-4 py-2">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnrollments.map(({ enrollment, status }) => (
                            <EnrollmentRow
                                key={enrollment.userId}
                                courseId={safeCourseId}
                                userId={enrollment.userId}
                                selected={selectedIds.has(enrollment.userId)}
                                onToggle={toggleSelection}
                                name={enrollment.name || "Unnamed Learner"}
                                email={enrollment.email}
                                enrolledAt={new Date(
                                    enrollment.enrolledAt,
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                                progressPercentage={
                                    enrollment.progressPercentage
                                }
                                status={status}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminCourseEnrollmentsPage;
