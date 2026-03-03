/**
 * AdminUsersPage - User management page for SUPER_ADMIN
 *
 * Features:
 * - List all users with pagination
 * - Filter by role, active status
 * - Search by name/email
 * - Promote STUDENT to ADMIN
 * - Delete/deactivate ADMIN
 * - Sort by various fields
 */

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import { useAuthStore } from "../../../../stores/authStore";
import { UserRole } from "../../../../types/auth.types";
import {
    useAdminUsersQuery,
    usePromoteToAdminMutation,
    useDeleteAdminMutation,
} from "../hooks";
import type { User } from "../../../../types/auth.types";

type RoleFilter = "ALL" | "STUDENT" | "ADMIN" | "SUPER_ADMIN";

const ROLE_TABS: { label: string; value: RoleFilter }[] = [
    { label: "All Users", value: "ALL" },
    { label: "Students", value: "STUDENT" },
    { label: "Admins", value: "ADMIN" },
    { label: "Super Admins", value: "SUPER_ADMIN" },
];

const ROLE_BADGE: Record<string, { bg: string; text: string }> = {
    STUDENT: { bg: "bg-blue-100", text: "text-blue-800" },
    ADMIN: { bg: "bg-purple-100", text: "text-purple-800" },
    SUPER_ADMIN: { bg: "bg-red-100", text: "text-red-800" },
};

const isRoleFilter = (value: string | null): value is RoleFilter =>
    value === "ALL" ||
    value === "STUDENT" ||
    value === "ADMIN" ||
    value === "SUPER_ADMIN";

const AdminUsersPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { getErrorMessage } = useApiError();
    const currentUser = useAuthStore((s) => s.user);
    const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;
    const [mutatingId, setMutatingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || "",
    );

    const roleFilter = useMemo<RoleFilter>(() => {
        const param = searchParams.get("role");
        return isRoleFilter(param) ? param : "ALL";
    }, [searchParams]);

    const page = useMemo(
        () => Number(searchParams.get("page")) || 1,
        [searchParams],
    );

    const queryRole = roleFilter === "ALL" ? undefined : roleFilter;

    const { data, isLoading, isError, error } = useAdminUsersQuery({
        page,
        limit: 20,
        search: searchParams.get("search") || undefined,
        role: queryRole,
        sortBy: "createdAt",
        order: "desc",
    });

    const promoteMutation = usePromoteToAdminMutation();
    const deleteMutation = useDeleteAdminMutation();

    const handleRoleChange = (next: RoleFilter) => {
        const params: Record<string, string> = {};
        if (next !== "ALL") params.role = next;
        if (searchParams.get("search"))
            params.search = searchParams.get("search")!;
        setSearchParams(params);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (roleFilter !== "ALL") params.role = roleFilter;
        if (searchTerm.trim()) params.search = searchTerm.trim();
        setSearchParams(params);
    };

    const handlePromote = (userId: string) => {
        if (!confirm("Are you sure you want to promote this user to ADMIN?")) {
            return;
        }
        setMutatingId(userId);
        promoteMutation.mutate(userId, {
            onSuccess: () => {
                alert("User promoted to ADMIN successfully");
            },
            onError: (err) => {
                alert(`Error: ${getErrorMessage(err)}`);
            },
            onSettled: () => setMutatingId(null),
        });
    };

    const handleDelete = (userId: string) => {
        if (
            !confirm("Are you sure you want to delete/deactivate this admin?")
        ) {
            return;
        }
        setMutatingId(userId);
        deleteMutation.mutate(userId, {
            onSuccess: () => {
                alert("Admin deleted successfully");
            },
            onError: (err) => {
                alert(`Error: ${getErrorMessage(err)}`);
            },
            onSettled: () => setMutatingId(null),
        });
    };

    const handlePageChange = (newPage: number) => {
        const params: Record<string, string> = { page: String(newPage) };
        if (roleFilter !== "ALL") params.role = roleFilter;
        if (searchParams.get("search"))
            params.search = searchParams.get("search")!;
        setSearchParams(params);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading users...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <p className="text-red-600">{getErrorMessage(error)}</p>
            </div>
        );
    }

    const users = data?.users || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / 20);

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                User Management
            </h1>

            {/* Search form */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Search
                </button>
                {searchParams.get("search") && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            const params: Record<string, string> = {};
                            if (roleFilter !== "ALL") params.role = roleFilter;
                            setSearchParams(params);
                        }}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Role filter tabs */}
            <div className="mb-4 flex gap-2">
                {ROLE_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => handleRoleChange(tab.value)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            roleFilter === tab.value
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* User count */}
            <p className="mb-4 text-sm text-gray-600">
                {total} user{total !== 1 ? "s" : ""} found
            </p>

            {/* Table */}
            {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Provider</th>
                                    <th className="px-4 py-3">Joined</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user: User) => {
                                    const roleBadge =
                                        ROLE_BADGE[user.role] ||
                                        ROLE_BADGE.STUDENT;
                                    const isMutating = mutatingId === user.id;
                                    const canPromote =
                                        isSuperAdmin &&
                                        user.role === UserRole.STUDENT;
                                    const canDelete =
                                        isSuperAdmin &&
                                        user.role === UserRole.ADMIN;

                                    return (
                                        <tr
                                            key={user.id}
                                            className="text-sm hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">
                                                    {user.name || "—"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {user.phoneNumber || "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    {user.isActive ? (
                                                        <span className="text-xs text-green-600">
                                                            ✓ Active
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            ✗ Inactive
                                                        </span>
                                                    )}
                                                    {user.isVerified ? (
                                                        <span className="text-xs text-green-600">
                                                            ✓ Verified
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-yellow-600">
                                                            ⚠ Unverified
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                {user.provider}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                {new Date(
                                                    user.createdAt,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {canPromote && (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isMutating
                                                            }
                                                            onClick={() =>
                                                                handlePromote(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="rounded bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {isMutating
                                                                ? "..."
                                                                : "Promote"}
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isMutating
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {isMutating
                                                                ? "..."
                                                                : "Delete"}
                                                        </button>
                                                    )}
                                                    {!canPromote &&
                                                        !canDelete && (
                                                            <span className="text-xs text-gray-400">
                                                                —
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => handlePageChange(page - 1)}
                                    className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={page >= totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                    className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminUsersPage;
