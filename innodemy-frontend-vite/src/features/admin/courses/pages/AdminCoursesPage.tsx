/**
 * AdminCoursesPage — Admin courses listing page
 *
 * Supports pagination, search (debounced), and status filtering.
 * Contract aligned with: docs/backend-admin-courses-api.md
 * Backend endpoint: GET /api/v1/courses
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    useAdminCoursesQuery,
    useDeleteCourseMutation,
    usePublishCourseMutation,
} from "../hooks";
import { useApiError } from "../../../../hooks/useApiError";
import AdminCourseRow from "../components/AdminCourseRow";
import type { AdminCoursesQueryParams, CourseStatus } from "../types";

type StatusFilter = CourseStatus | undefined;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: undefined },
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
];

const EMPTY_MESSAGES: Record<string, string> = {
    DRAFT: "No draft courses.",
    PUBLISHED: "No published courses.",
};

const DEBOUNCE_MS = 350;
const PAGE_SIZE = 10;

const AdminCoursesPage = () => {
    /* ── Local filter state ─────────────────────────────── */
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedStatus, setSelectedStatus] =
        useState<StatusFilter>(undefined);

    /* ── Debounce search input ──────────────────────────── */
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchInput(value);

            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(() => {
                setDebouncedSearch(value.trim());
                setPage(1); // reset to first page on new search
            }, DEBOUNCE_MS);
        },
        [],
    );

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    /* ── Reset page when status filter changes ──────────── */
    const handleStatusChange = useCallback((status: StatusFilter) => {
        setSelectedStatus(status);
        setPage(1);
    }, []);

    /* ── Query params (derived) ─────────────────────────── */
    const queryParams: AdminCoursesQueryParams = useMemo(() => {
        const params: AdminCoursesQueryParams = {
            page,
            limit: PAGE_SIZE,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedStatus) params.status = selectedStatus;
        return params;
    }, [page, debouncedSearch, selectedStatus]);

    /* ── Data fetching ──────────────────────────────────── */
    const { data, isLoading, isError, error, isFetching } =
        useAdminCoursesQuery(queryParams);
    const { getErrorMessage } = useApiError();

    /* ── Mutations ──────────────────────────────────────── */
    const publishMutation = usePublishCourseMutation();
    const deleteMutation = useDeleteCourseMutation();
    const [publishingId, setPublishingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handlePublish = (id: string) => {
        if (publishMutation.isPending) return;

        const confirmed = window.confirm(
            "Are you sure you want to publish this course?",
        );
        if (!confirmed) return;

        setPublishingId(id);
        publishMutation.mutate(id, {
            onSuccess: () => {
                setPublishingId(null);
                alert("Course published");
            },
            onError: (err) => {
                setPublishingId(null);
                alert(getErrorMessage(err));
            },
        });
    };

    const handleDelete = (id: string) => {
        if (deleteMutation.isPending) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this course?",
        );
        if (!confirmed) return;

        setDeletingId(id);
        deleteMutation.mutate(id, {
            onSuccess: () => {
                setDeletingId(null);
                alert("Course deleted");
            },
            onError: (err) => {
                setDeletingId(null);
                alert(getErrorMessage(err));
            },
        });
    };

    /* ── Derived values ─────────────────────────────────── */
    const meta = data?.meta;
    const totalPages = meta?.totalPages ?? 0;
    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;

    const emptyMessage = selectedStatus
        ? EMPTY_MESSAGES[selectedStatus]
        : debouncedSearch
          ? `No courses matching "${debouncedSearch}".`
          : "No courses created yet.";

    return (
        <div className="p-6">
            {/* ── Header + Search ─────────────────────────── */}
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Courses</h1>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="Search courses..."
                        className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                    {isFetching && debouncedSearch && (
                        <span className="text-xs text-gray-400">...</span>
                    )}
                    <Link
                        to="create"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Create Course
                    </Link>
                </div>
            </div>

            {/* ── Status filter tabs ─────────────────────── */}
            <div className="mb-4 flex gap-2">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.label}
                        type="button"
                        onClick={() => handleStatusChange(tab.value)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            selectedStatus === tab.value
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Loading state ───────────────────────────── */}
            {isLoading && (
                <p className="py-4 text-gray-500">Loading courses...</p>
            )}

            {/* ── Error state ─────────────────────────────── */}
            {isError && (
                <p className="py-4 text-red-600">{getErrorMessage(error)}</p>
            )}

            {/* ── Empty state ─────────────────────────────── */}
            {data && data.data.length === 0 && (
                <p className="py-4 text-gray-500">{emptyMessage}</p>
            )}

            {/* ── Courses table ───────────────────────────── */}
            {data && data.data.length > 0 && (
                <table className="mt-4 w-full table-auto">
                    <thead>
                        <tr className="border-b border-gray-300 text-left text-sm font-medium text-gray-600">
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Created</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((course) => (
                            <AdminCourseRow
                                key={course.id}
                                course={course}
                                onPublish={handlePublish}
                                isPublishing={publishMutation.isPending}
                                publishingId={publishingId}
                                onDelete={handleDelete}
                                isDeleting={deleteMutation.isPending}
                                deletingId={deletingId}
                            />
                        ))}
                    </tbody>
                </table>
            )}

            {/* ── Pagination controls ─────────────────────── */}
            {totalPages > 0 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <button
                        type="button"
                        disabled={isFirstPage}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                        {meta && (
                            <span className="ml-2 text-gray-400">
                                ({meta.total} total)
                            </span>
                        )}
                    </span>

                    <button
                        type="button"
                        disabled={isLastPage}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminCoursesPage;
