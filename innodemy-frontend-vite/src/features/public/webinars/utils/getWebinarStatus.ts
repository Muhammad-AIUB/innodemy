export type WebinarStatus = "upcoming" | "live" | "completed";

const getWebinarStatus = (date: string, duration: number): WebinarStatus => {
    const now = Date.now();
    const start = new Date(date).getTime();
    const end = start + duration * 60_000;

    if (now < start) return "upcoming";
    if (now < end) return "live";
    return "completed";
};

export default getWebinarStatus;
