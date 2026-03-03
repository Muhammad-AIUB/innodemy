import { useMemo } from "react";
import { useApiError } from "../../../../hooks/useApiError";
import { useWebinarsQuery } from "../hooks";
import getWebinarStatus from "../utils/getWebinarStatus";
import WebinarSection from "../components/WebinarSection";

const WebinarsPage = () => {
    const { data: webinars, isLoading, isError, error } = useWebinarsQuery();
    const { getErrorMessage } = useApiError();

    const upcoming = useMemo(
        () =>
            (webinars ?? []).filter((w) => {
                const status = getWebinarStatus(w.date, w.duration);
                return status === "upcoming" || status === "live";
            }),
        [webinars],
    );

    const past = useMemo(
        () =>
            (webinars ?? []).filter(
                (w) => getWebinarStatus(w.date, w.duration) === "completed",
            ),
        [webinars],
    );

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-gray-500">Loading webinars...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-red-600">{getErrorMessage(error)}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">Webinars</h1>

            <WebinarSection
                title="Upcoming Webinars"
                webinars={upcoming}
                emptyMessage="No upcoming webinars at the moment."
            />

            <WebinarSection
                title="Past Webinars"
                webinars={past}
                emptyMessage="No past webinars yet."
            />
        </div>
    );
};

export default WebinarsPage;
