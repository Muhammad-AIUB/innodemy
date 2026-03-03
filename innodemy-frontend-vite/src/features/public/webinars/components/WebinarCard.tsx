import { Link } from "react-router-dom";
import type { Webinar } from "../types";
import getWebinarStatus, { type WebinarStatus } from "../utils/getWebinarStatus";

interface WebinarCardProps {
    webinar: Webinar;
}

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const STATUS_STYLES: Record<WebinarStatus, string> = {
    upcoming: "bg-blue-100 text-blue-800",
    live: "bg-red-100 text-red-700 animate-pulse",
    completed: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<WebinarStatus, string> = {
    upcoming: "Upcoming",
    live: "🔴 Live",
    completed: "Completed",
};

const WebinarCard = ({ webinar }: WebinarCardProps) => {
    const status = getWebinarStatus(webinar.date, webinar.duration);

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Image */}
            {webinar.image && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                        src={webinar.image}
                        alt={webinar.title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            <div className="p-4">
                {/* Status badge */}
                <span
                    className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
                >
                    {STATUS_LABELS[status]}
                </span>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {webinar.title}
                </h3>

                {/* Date & time */}
                <p className="mb-1 text-sm text-gray-600">
                    {formatDate(webinar.date)}
                    {webinar.time ? ` · ${webinar.time}` : ""}
                </p>

                {/* Instructor */}
                {webinar.instructor && (
                    <p className="mb-3 text-sm text-gray-500">
                        {webinar.instructor}
                    </p>
                )}

                {/* View Details */}
                <Link
                    to={`/webinars/${webinar.slug}`}
                    className="inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default WebinarCard;
