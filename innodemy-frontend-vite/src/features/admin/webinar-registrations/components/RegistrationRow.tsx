import type { AdminWebinarRegistration } from "../types";

interface RegistrationRowProps {
    registration: AdminWebinarRegistration;
}

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const RegistrationRow = ({ registration }: RegistrationRowProps) => {
    return (
        <tr className="border-b border-gray-100 text-sm">
            <td className="px-4 py-3 text-gray-900">{registration.name}</td>
            <td className="px-4 py-3 text-gray-600">{registration.email}</td>
            <td className="px-4 py-3 text-gray-600">{registration.phone}</td>
            <td className="px-4 py-3 text-gray-500">
                {formatDate(registration.createdAt)}
            </td>
        </tr>
    );
};

export default RegistrationRow;
