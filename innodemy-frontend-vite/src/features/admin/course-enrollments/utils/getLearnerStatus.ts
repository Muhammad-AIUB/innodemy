export type LearnerStatus =
    | "completed"
    | "at-risk"
    | "not-started"
    | "in-progress";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const getLearnerStatus = (
    progressPercentage: number,
    enrolledAt: string,
): LearnerStatus => {
    if (progressPercentage === 100) {
        return "completed";
    }

    if (progressPercentage === 0) {
        return "not-started";
    }

    const enrolledAtTime = new Date(enrolledAt).getTime();
    const isValidDate = Number.isFinite(enrolledAtTime);
    const isOlderThanSevenDays =
        isValidDate && Date.now() - enrolledAtTime > SEVEN_DAYS_MS;

    if (progressPercentage < 20 && isOlderThanSevenDays) {
        return "at-risk";
    }

    return "in-progress";
};
