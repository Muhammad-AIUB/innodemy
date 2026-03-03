import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import { useAllRegistrationsQuery } from "../hooks";

const AllWebinarRegistrationsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { getErrorMessage } = useApiError();
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || "",
    );

    const page = useMemo(
        () => Number(searchParams.get("page")) || 1,
        [searchParams],
    );

    const { data, isLoading, isError, error } = useAllRegistrationsQuery({
        page,
        limit: 20,
        search: searchParams.get("search") || undefined,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (searchTerm.trim()) params.search = searchTerm.trim();
        setSearchParams(params);
    };

    const handlePageChange = (newPage: number) => {
        const params: Record<string, string> = { page: String(newPage) };
        if (searchParams.get("search"))
            params.search = searchParams.get("search")!;
        setSearchParams(params);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading registrations...</p>
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

    const registrations = data?.registrations || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / 20);

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Webinar Registrations
            </h1>

            {/* Search form */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or phone..."
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
                            setSearchParams({});
                        }}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Count */}
            <p className="mb-4 text-sm text-gray-600">
                {total} registration{total !== 1 ? "s" : ""} found
            </p>

            {registrations.length === 0 ? (
                <p className="text-gray-500">No registrations found.</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Webinar</th>
                                    <th className="px-4 py-3">Registered At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {registrations.map((reg) => (
                                    <tr
                                        key={reg.id}
                                        className="text-sm hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {reg.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {reg.email}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {reg.phone}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800">
                                                {reg.webinar.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(
                                                    reg.webinar.date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600">
                                            {new Date(
                                                reg.createdAt,
                                            ).toLocaleDateString()}{" "}
                                            {new Date(
                                                reg.createdAt,
                                            ).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
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

export default AllWebinarRegistrationsPage;
