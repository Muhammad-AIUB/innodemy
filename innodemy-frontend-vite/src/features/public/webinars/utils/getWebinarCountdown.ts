export interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const getWebinarCountdown = (date: string): Countdown | null => {
    const diff = new Date(date).getTime() - Date.now();

    if (diff <= 0) return null;

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 60_000) % 60;
    const hours = Math.floor(diff / 3_600_000) % 24;
    const days = Math.floor(diff / 86_400_000);

    return { days, hours, minutes, seconds };
};

export default getWebinarCountdown;
