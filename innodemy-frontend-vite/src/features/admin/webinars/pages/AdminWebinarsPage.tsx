import { useState } from "react";
import { Link } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import {
    useAdminWebinarsQuery,
    usePublishWebinarMutation,
    useDeleteWebinarMutation,
} from "../hooks";
import AdminWebinarRow from "../components/AdminWebinarRow";

const AdminWebinarsPage = () => {
    const { data, isLoading, isError, error } = useAdminWebinarsQuery();
    const { getErrorMessage } = useApiError();
    const [actioningId, setActioningId] = useState<string | null>(null);

    const publishMutation = usePublishWebinarMutation();
    const deleteMutation = useDeleteWebinarMutation();

    const handlePublish = (id: string) => {
        setActioningId(id);
        publishMutation.mutate(id, {
            onSettled: () => setActioningId(null),
        });
    };

    const handleDelete = (id: string) => {
        if (!window.confirm("Delete this webinar?")) return;
        setActioningId(id);
        deleteMutation.mutate(id, {
            onSettled: () => setActioningId(null),
        });
    };

    if (isLoading) {
        return <p>Loading webinars...</p>;
    }

    if (isError) {
        return <p className="text-red-600">{getErrorMessage(error)}</p>;
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Webinars</h1>
                <Link
                    to="/admin/webinars/create"
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Create Webinar
                </Link>
            </div>

            {!data || data.length === 0 ? (
                <p className="text-gray-500">No webinars yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b border-gray-300 text-left text-sm font-medium text-gray-600">
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Instructor</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((webinar) => (
                                <AdminWebinarRow
                                    key={webinar.id}
                                    webinar={webinar}
                                    onPublish={handlePublish}
                                    onDelete={handleDelete}
                                    isActioning={actioningId === webinar.id}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminWebinarsPage;
