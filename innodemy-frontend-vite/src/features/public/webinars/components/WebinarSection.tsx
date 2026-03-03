import type { Webinar } from "../types";
import WebinarCard from "./WebinarCard";

interface WebinarSectionProps {
    title: string;
    webinars: Webinar[];
    emptyMessage: string;
}

const WebinarSection = ({
    title,
    webinars,
    emptyMessage,
}: WebinarSectionProps) => {
    return (
        <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
                {title}
            </h2>
            {webinars.length === 0 ? (
                <p className="text-gray-500">{emptyMessage}</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {webinars.map((webinar) => (
                        <WebinarCard key={webinar.slug} webinar={webinar} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default WebinarSection;
