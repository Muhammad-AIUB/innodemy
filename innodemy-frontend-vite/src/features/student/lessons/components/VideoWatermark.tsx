/**
 * Dynamic video watermark — renders the user's email as a
 * semi-transparent, moving overlay on top of the video.
 *
 * Multiple instances are placed across the video at different
 * positions and a "roaming" instance animates diagonally so
 * that any screen-recording will always contain the user's
 * identity no matter when a screenshot is taken.
 *
 * Techniques used by Udemy, Programming Hero, Learn With Sumit, etc.
 */

import { useEffect, useRef } from "react";

interface VideoWatermarkProps {
    email: string;
    userId?: string;
}

const VideoWatermark = ({ email, userId }: VideoWatermarkProps) => {
    const roamingRef = useRef<HTMLDivElement | null>(null);

    // Roaming watermark — moves diagonally across the video
    useEffect(() => {
        const el = roamingRef.current;
        if (!el) return;

        let x = Math.random() * 60 + 10; // 10-70%
        let y = Math.random() * 60 + 10;
        let dx = 0.03;
        let dy = 0.02;
        let raf: number;

        const animate = () => {
            x += dx;
            y += dy;

            if (x > 75 || x < 5) dx = -dx;
            if (y > 75 || y < 5) dy = -dy;

            el.style.left = `${x}%`;
            el.style.top = `${y}%`;

            raf = requestAnimationFrame(animate);
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Generate a unique identifier visible on recordings
    const watermarkText = email;
    const shortId = userId ? userId.slice(0, 8) : "";

    return (
        <div
            className="pointer-events-none absolute inset-0 z-20 select-none overflow-hidden"
            aria-hidden="true"
        >
            {/* ── Static grid watermarks ─────────────────────────── */}
            {/* Top-left */}
            <span
                className="absolute text-xs font-medium tracking-wide text-white/20"
                style={{ top: "8%", left: "5%", transform: "rotate(-15deg)" }}
            >
                {watermarkText}
            </span>

            {/* Top-right */}
            <span
                className="absolute text-xs font-medium tracking-wide text-white/20"
                style={{ top: "12%", right: "5%", transform: "rotate(12deg)" }}
            >
                {watermarkText}
            </span>

            {/* Center */}
            <span
                className="absolute text-sm font-semibold tracking-wider text-white/15"
                style={{ top: "45%", left: "30%", transform: "rotate(-8deg)" }}
            >
                {watermarkText}
            </span>

            {/* Bottom-left */}
            <span
                className="absolute text-xs font-medium tracking-wide text-white/20"
                style={{
                    bottom: "15%",
                    left: "8%",
                    transform: "rotate(10deg)",
                }}
            >
                {watermarkText}
            </span>

            {/* Bottom-right */}
            <span
                className="absolute text-xs font-medium tracking-wide text-white/20"
                style={{
                    bottom: "10%",
                    right: "5%",
                    transform: "rotate(-12deg)",
                }}
            >
                {shortId && <span className="mr-2 text-[10px]">{shortId}</span>}
                {watermarkText}
            </span>

            {/* ── Roaming watermark ──────────────────────────────── */}
            <div
                ref={roamingRef}
                className="absolute text-sm font-semibold tracking-wider text-white/20"
                style={{
                    transform: "rotate(-20deg)",
                    whiteSpace: "nowrap",
                    willChange: "left, top",
                }}
            >
                {watermarkText}
            </div>

            {/* ── Tiled diagonal pattern (forensic watermark) ────── */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 180px,
                        rgba(255,255,255,0.02) 180px,
                        rgba(255,255,255,0.02) 181px
                    )`,
                }}
            />
        </div>
    );
};

export default VideoWatermark;
