import { useParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import { useAdminWebinarRegistrationsQuery } from "../hooks";
import RegistrationRow from "../components/RegistrationRow";

const AdminWebinarRegistrationsPage = () => {
    const { webinarId } = useParams<{ webinarId: string }>();
    const { data, isLoading, isError, error } =
        useAdminWebinarRegistrationsQuery(webinarId ?? "");
    const { getErrorMessage } = useApiError();

    if (isLoading) {
        return <p>Loading registrations...</p>;
    }

    if (isError) {
        return <p className="text-red-600">{getErrorMessage(error)}</p>;
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Webinar Registrations
            </h1>

            {!data || data.length === 0 ? (
                <p className="text-gray-500">No registrations yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b border-gray-300 text-left text-sm font-medium text-gray-600">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((reg) => (
                                <RegistrationRow
                                    key={reg.id}
                                    registration={reg}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminWebinarRegistrationsPage;
