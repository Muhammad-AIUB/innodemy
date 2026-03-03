import { Link } from "react-router-dom";
import {
    useInstructorsQuery,
    useToggleInstructorStatusMutation,
    useDeleteInstructorMutation,
} from "../hooks";

const InstructorsPage = () => {
    const { data: instructors = [], isLoading, error } = useInstructorsQuery();
    const toggleStatusMutation = useToggleInstructorStatusMutation();
    const deleteMutation = useDeleteInstructorMutation();

    const handleToggleStatus = (id: string) => {
        if (confirm("Are you sure you want to toggle the instructor status?")) {
            toggleStatusMutation.mutate(id);
        }
    };

    const handleDelete = (id: string) => {
        if (
            confirm(
                "Are you sure you want to delete this instructor? This action cannot be undone.",
            )
        ) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <div className="p-6">Loading instructors...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-600">
                Error loading instructors: {error.message}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Instructors
                </h1>
                <Link
                    to="/admin/instructors/create"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Add New Instructor
                </Link>
            </div>

            {instructors.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                    <p className="text-gray-500">No instructors found.</p>
                    <Link
                        to="/admin/instructors/create"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        Create your first instructor
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {instructors.map((instructor) => (
                        <div
                            key={instructor.id}
                            className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {instructor.name}
                                    </h3>
                                    <span
                                        className={`mt-1 inline-block rounded px-2 py-1 text-xs font-medium ${
                                            instructor.status === "ACTIVE"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {instructor.status}
                                    </span>
                                </div>
                                {instructor.image && (
                                    <img
                                        src={instructor.image}
                                        alt={instructor.name}
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                )}
                            </div>

                            {instructor.bio && (
                                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                                    {instructor.bio}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <Link
                                    to={`/admin/instructors/${instructor.id}/edit`}
                                    className="flex-1 rounded border border-blue-600 px-3 py-1.5 text-center text-sm font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() =>
                                        handleToggleStatus(instructor.id)
                                    }
                                    disabled={toggleStatusMutation.isPending}
                                    className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {instructor.status === "ACTIVE"
                                        ? "Deactivate"
                                        : "Activate"}
                                </button>
                                <button
                                    onClick={() => handleDelete(instructor.id)}
                                    disabled={deleteMutation.isPending}
                                    className="rounded border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorsPage;
