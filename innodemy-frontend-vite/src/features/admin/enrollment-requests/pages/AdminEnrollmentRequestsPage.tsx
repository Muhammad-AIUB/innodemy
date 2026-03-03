import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import getImageUrl from "../../../shared/utils/getImageUrl";
import type { EnrollmentRequestStatus } from "../../../student/enrollment-requests/types";
import {
    useAdminEnrollmentRequestsQuery,
    useApproveEnrollmentRequestMutation,
    useRejectEnrollmentRequestMutation,
} from "../hooks";

type FilterMode = "ALL" | EnrollmentRequestStatus;

const FILTER_TABS: { label: string; value: FilterMode }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
];

const STATUS_BADGE: Record<
    EnrollmentRequestStatus,
    { bg: string; text: string }
> = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
    APPROVED: { bg: "bg-green-100", text: "text-green-800" },
    REJECTED: { bg: "bg-red-100", text: "text-red-800" },
};

const isFilterMode = (value: string | null): value is FilterMode =>
    value === "ALL" ||
    value === "PENDING" ||
    value === "APPROVED" ||
    value === "REJECTED";

const AdminEnrollmentRequestsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { getErrorMessage } = useApiError();
    const [mutatingId, setMutatingId] = useState<string | null>(null);

    const filterMode = useMemo<FilterMode>(() => {
        const param = searchParams.get("status");
        return isFilterMode(param) ? param : "ALL";
    }, [searchParams]);

    const queryStatus =
        filterMode === "ALL"
            ? undefined
            : (filterMode as EnrollmentRequestStatus);

    const { data, isLoading, isError, error } =
        useAdminEnrollmentRequestsQuery(queryStatus);

    const approveMutation = useApproveEnrollmentRequestMutation();
    const rejectMutation = useRejectEnrollmentRequestMutation();

    const handleFilterChange = (next: FilterMode) => {
        if (next === "ALL") {
            setSearchParams({});
        } else {
            setSearchParams({ status: next });
        }
    };

    const handleApprove = (id: string) => {
        setMutatingId(id);
        approveMutation.mutate(
            { id },
            { onSettled: () => setMutatingId(null) },
        );
    };

    const handleReject = (id: string) => {
        setMutatingId(id);
        rejectMutation.mutate({ id }, { onSettled: () => setMutatingId(null) });
    };

    if (isLoading) {
        return <p>Loading enrollment requests...</p>;
    }

    if (isError) {
        return <p className="text-red-600">{getErrorMessage(error)}</p>;
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Enrollment Requests
            </h1>

            {/* Filter tabs */}
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

            {/* Table */}
            {!data || data.length === 0 ? (
                <p className="text-gray-500">No enrollment requests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b border-gray-300 text-left text-sm font-medium text-gray-600">
                                <th className="px-4 py-2">Student</th>
                                <th className="px-4 py-2">Course</th>
                                <th className="px-4 py-2">Payment Method</th>
                                <th className="px-4 py-2">Trx ID</th>
                                <th className="px-4 py-2">Proof</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((request) => {
                                const badge = STATUS_BADGE[request.status];
                                const isMutating = mutatingId === request.id;
                                const isPending = request.status === "PENDING";

                                return (
                                    <tr
                                        key={request.id}
                                        className="border-b border-gray-100 text-sm"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">
                                                {request.user.name || "Unnamed"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {request.user.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {request.course.title}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {request.paymentMethod}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                                            {request.transactionId}
                                        </td>
                                        <td className="px-4 py-3">
                                            {request.screenshotUrl ? (
                                                <a
                                                    href={getImageUrl(
                                                        request.screenshotUrl,
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    <img
                                                        src={getImageUrl(
                                                            request.screenshotUrl,
                                                        )}
                                                        alt="Payment proof"
                                                        className="h-12 w-12 rounded border border-gray-200 object-cover hover:opacity-75"
                                                    />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    No proof
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
                                            >
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {isPending ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={isMutating}
                                                        onClick={() =>
                                                            handleApprove(
                                                                request.id,
                                                            )
                                                        }
                                                        className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isMutating
                                                            ? "..."
                                                            : "Approve"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isMutating}
                                                        onClick={() =>
                                                            handleReject(
                                                                request.id,
                                                            )
                                                        }
                                                        className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isMutating
                                                            ? "..."
                                                            : "Reject"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminEnrollmentRequestsPage;
