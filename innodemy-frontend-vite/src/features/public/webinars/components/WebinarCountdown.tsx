import { useEffect, useState } from "react";
import getWebinarCountdown, {
    type Countdown,
} from "../utils/getWebinarCountdown";

interface WebinarCountdownProps {
    date: string;
}

const pad = (n: number): string => String(n).padStart(2, "0");

const WebinarCountdown = ({ date }: WebinarCountdownProps) => {
    const [countdown, setCountdown] = useState<Countdown | null>(() =>
        getWebinarCountdown(date),
    );

    useEffect(() => {
        const id = setInterval(() => {
            const next = getWebinarCountdown(date);
            setCountdown(next);
            if (!next) clearInterval(id);
        }, 1000);

        return () => clearInterval(id);
    }, [date]);

    if (!countdown) return null;

    return (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="mb-2 text-sm font-medium text-blue-800">
                Starts in
            </p>
            <p className="text-2xl font-bold tracking-wider text-blue-900">
                {pad(countdown.days)}d : {pad(countdown.hours)}h :{" "}
                {pad(countdown.minutes)}m : {pad(countdown.seconds)}s
            </p>
        </div>
    );
};

export default WebinarCountdown;
