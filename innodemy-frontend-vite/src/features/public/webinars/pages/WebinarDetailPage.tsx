import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApiError } from "../../../../hooks/useApiError";
import { useWebinarDetailQuery } from "../hooks";
import getWebinarStatus from "../utils/getWebinarStatus";
import WebinarCountdown from "../components/WebinarCountdown";
import WebinarRegistrationDrawer from "../../webinar-registrations/components/WebinarRegistrationDrawer";

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const WebinarDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: webinar, isLoading, isError, error } =
        useWebinarDetailQuery(slug ?? "");
    const { getErrorMessage } = useApiError();
    const [drawerOpen, setDrawerOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12">
                <p className="text-gray-500">Loading webinar...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12">
                <p className="text-red-600">{getErrorMessage(error)}</p>
            </div>
        );
    }

    if (!webinar) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12">
                <p className="text-red-600">Webinar not found.</p>
            </div>
        );
    }

    const status = getWebinarStatus(webinar.date, webinar.duration);

    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            {/* Status banner */}
            {status === "live" && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800">
                    <p className="text-lg font-semibold">
                        🔴 Live Now — Join Immediately
                    </p>
                </div>
            )}
            {status === "completed" && (
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-600">
                    <p className="text-lg font-semibold">
                        ✔ Webinar Completed
                    </p>
                </div>
            )}

            {/* Countdown (upcoming only) */}
            {status === "upcoming" && (
                <WebinarCountdown date={webinar.date} />
            )}

            {/* Hero image */}
            {webinar.image && (
                <img
                    src={webinar.image}
                    alt={webinar.title}
                    className="mb-6 h-64 w-full rounded-lg object-cover"
                />
            )}

            {/* Title */}
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {webinar.title}
            </h1>

            {/* Date & time */}
            <p className="mb-4 text-gray-600">
                {formatDate(webinar.date)}
                {webinar.time ? ` · ${webinar.time}` : ""}
            </p>

            {/* Instructor info */}
            {webinar.instructor && (
                <div className="mb-6 flex items-center gap-3">
                    {webinar.instructorImage && (
                        <img
                            src={webinar.instructorImage}
                            alt={webinar.instructor}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    )}
                    <p className="text-sm font-medium text-gray-900">
                        {webinar.instructor}
                    </p>
                </div>
            )}

            {/* Description */}
            <p className="mb-8 text-gray-700">{webinar.description}</p>

            {/* Section One */}
            {webinar.sectionOneTitle && (
                <section className="mb-8">
                    <h2 className="mb-3 text-xl font-semibold text-gray-900">
                        {webinar.sectionOneTitle}
                    </h2>
                    {webinar.sectionOnePoints.length > 0 && (
                        <ul className="list-inside list-disc space-y-1 text-gray-600">
                            {webinar.sectionOnePoints.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    )}
                </section>
            )}

            {/* Section Two */}
            {webinar.sectionTwoTitle && (
                <section className="mb-8">
                    <h2 className="mb-3 text-xl font-semibold text-gray-900">
                        {webinar.sectionTwoTitle}
                    </h2>
                    {webinar.sectionTwoPoints.length > 0 && (
                        <ul className="list-inside list-disc space-y-1 text-gray-600">
                            {webinar.sectionTwoPoints.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    )}
                </section>
            )}

            {/* Registration button */}
            {status === "completed" ? (
                <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-md bg-gray-400 px-6 py-3 text-sm font-medium text-white"
                >
                    Registration Closed
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Register Free
                </button>
            )}

            {/* Registration Drawer */}
            <WebinarRegistrationDrawer
                webinarId={webinar.id}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
};

export default WebinarDetailPage;
