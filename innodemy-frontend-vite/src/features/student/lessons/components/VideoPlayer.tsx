import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import VideoWatermark from "./VideoWatermark";
import VideoProtectionOverlay from "./VideoProtectionOverlay";
import useAntiPiracy from "../hooks/useAntiPiracy";

interface VideoPlayerProps {
    url: string;
    onEnded?: () => void;
    /** User email for watermarking — enables anti-piracy when provided */
    userEmail?: string;
    /** User ID for forensic watermark */
    userId?: string;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const formatTime = (seconds: number): string => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
};

const VideoPlayer = ({ url, onEnded, userEmail, userId }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showRateMenu, setShowRateMenu] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [seeking, setSeeking] = useState(false);
    const [ready, setReady] = useState(false);

    // ── Anti-piracy protection ──────────────────────────────────────
    const antiPiracyEnabled = !!userEmail;
    const { isDevToolsOpen, piracyWarning } = useAntiPiracy(
        containerRef,
        videoRef,
        {
            onPause: () => setPlaying(false),
            enabled: antiPiracyEnabled,
        },
    );

    // ── Fullscreen detection ────────────────────────────────────────
    useEffect(() => {
        const handleFsChange = () =>
            setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handleFsChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    // ── Auto-hide controls ──────────────────────────────────────────
    const resetControlsTimeout = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current)
            clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (playing) setShowControls(false);
        }, 3000);
    }, [playing]);

    // When playback starts, kick off auto-hide timer; when paused, clear it.
    // Controls visibility when paused is handled via `|| !playing` in the className.
    useEffect(() => {
        if (controlsTimeoutRef.current)
            clearTimeout(controlsTimeoutRef.current);

        if (playing) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }

        return () => {
            if (controlsTimeoutRef.current)
                clearTimeout(controlsTimeoutRef.current);
        };
    }, [playing]);

    // ── Close rate menu on outside click ────────────────────────────
    useEffect(() => {
        if (!showRateMenu) return;
        const close = () => setShowRateMenu(false);
        document.addEventListener("click", close, { once: true });
        return () => document.removeEventListener("click", close);
    }, [showRateMenu]);

    const toggleFullscreen = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }, []);

    // ── Keyboard shortcuts ──────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement;
            if (
                t.tagName === "INPUT" ||
                t.tagName === "TEXTAREA" ||
                t.isContentEditable
            )
                return;

            const video = videoRef.current;
            if (!video) return;

            switch (e.key) {
                case " ":
                case "k":
                    e.preventDefault();
                    setPlaying((p) => !p);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    video.currentTime = Math.min(
                        video.currentTime + 10,
                        video.duration || 0,
                    );
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    video.currentTime = Math.max(video.currentTime - 10, 0);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setVolume((v) => Math.min(v + 0.1, 1));
                    setMuted(false);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setVolume((v) => Math.max(v - 0.1, 0));
                    break;
                case "m":
                    e.preventDefault();
                    setMuted((prev) => !prev);
                    break;
                case "f":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "j":
                    e.preventDefault();
                    video.currentTime = Math.max(video.currentTime - 10, 0);
                    break;
                case "l":
                    e.preventDefault();
                    video.currentTime = Math.min(
                        video.currentTime + 10,
                        video.duration || 0,
                    );
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleFullscreen]);

    // ── Native video event handlers ─────────────────────────────────
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || seeking) return;
        setCurrentTime(video.currentTime);
        if (video.duration > 0) setPlayed(video.currentTime / video.duration);
    };

    const handleProgressEvent = () => {
        const video = videoRef.current;
        if (!video || video.buffered.length === 0 || !video.duration) return;
        setBuffered(
            video.buffered.end(video.buffered.length - 1) / video.duration,
        );
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setPlayed(value);
        const video = videoRef.current;
        if (video && video.duration) setCurrentTime(value * video.duration);
    };

    const handleSeekMouseDown = () => setSeeking(true);

    const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
        setSeeking(false);
        const value = parseFloat((e.target as HTMLInputElement).value);
        const video = videoRef.current;
        if (video && video.duration) video.currentTime = value * video.duration;
    };

    const handlePlayPause = () => {
        setPlaying((p) => !p);
        resetControlsTimeout();
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        setMuted(v === 0);
    };

    const selectRate = (rate: number) => {
        setPlaybackRate(rate);
        setShowRateMenu(false);
    };

    const skip = (delta: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.min(
            Math.max(video.currentTime + delta, 0),
            video.duration || 0,
        );
        resetControlsTimeout();
    };

    // ── Volume icon ─────────────────────────────────────────────────
    const volumeIcon = () => {
        if (muted || volume === 0) {
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                >
                    <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
            );
        }
        if (volume < 0.5) {
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                >
                    <path d="M18.5 12A4.5 4.5 0 0016 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                </svg>
            );
        }
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
        );
    };

    return (
        <div
            ref={containerRef}
            className="video-protection-container group relative aspect-video w-full overflow-hidden rounded-lg bg-black"
            onMouseMove={resetControlsTimeout}
            onContextMenu={(e) => e.preventDefault()}
            style={
                {
                    // CSS-level protection: content is not selectable/draggable
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                } as React.CSSProperties
            }
            onClick={(e) => {
                if ((e.target as HTMLElement).closest("[data-controls]"))
                    return;
                handlePlayPause();
            }}
        >
            {/* Anti-piracy protection overlay */}
            <VideoProtectionOverlay
                warning={piracyWarning}
                isDevToolsOpen={isDevToolsOpen}
            />

            {/* Dynamic watermark with user email */}
            {userEmail && <VideoWatermark email={userEmail} userId={userId} />}

            {/* react-player wraps the native <video> */}
            <ReactPlayer
                ref={videoRef}
                src={url}
                playing={playing}
                volume={volume}
                muted={muted}
                playbackRate={playbackRate}
                onTimeUpdate={handleTimeUpdate}
                onProgress={handleProgressEvent}
                onDurationChange={() => {
                    const v = videoRef.current;
                    if (v && v.duration) setDuration(v.duration);
                }}
                onEnded={() => {
                    setPlaying(false);
                    onEnded?.();
                }}
                onCanPlay={() => setReady(true)}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
            />

            {/* Big center play button when paused */}
            {!playing && ready && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black/60 p-4">
                        <svg
                            viewBox="0 0 24 24"
                            fill="white"
                            className="h-12 w-12"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Loading spinner */}
            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                </div>
            )}

            {/* ── Bottom controls overlay ──────────────────────────── */}
            <div
                data-controls
                className={`video-controls absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-10 transition-opacity duration-300 ${showControls || !playing ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
                {/* Progress bar */}
                <div className="group/seek relative mb-2 h-1 w-full cursor-pointer">
                    <div
                        className="absolute left-0 top-0 h-full rounded-full bg-white/30"
                        style={{ width: `${buffered * 100}%` }}
                    />
                    <div
                        className="absolute left-0 top-0 h-full rounded-full bg-red-500"
                        style={{ width: `${played * 100}%` }}
                    />
                    {/* Thumb dot */}
                    <div
                        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-red-500 transition-transform group-hover/seek:scale-100"
                        style={{ left: `${played * 100}%` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={0.999999}
                        step="any"
                        value={played}
                        onMouseDown={handleSeekMouseDown}
                        onChange={handleSeekChange}
                        onMouseUp={handleSeekMouseUp}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-1.5 text-white sm:gap-2">
                    {/* Play / Pause */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause();
                        }}
                        className="rounded p-1 hover:bg-white/20"
                        title={playing ? "Pause (k)" : "Play (k)"}
                    >
                        {playing ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    {/* Skip backward 10s */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            skip(-10);
                        }}
                        className="rounded p-1 hover:bg-white/20"
                        title="Rewind 10s (j)"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                            <text
                                x="12"
                                y="16"
                                textAnchor="middle"
                                fill="currentColor"
                                fontSize="7"
                                fontWeight="bold"
                            >
                                10
                            </text>
                        </svg>
                    </button>

                    {/* Skip forward 10s */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            skip(10);
                        }}
                        className="rounded p-1 hover:bg-white/20"
                        title="Forward 10s (l)"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                            <text
                                x="12"
                                y="16"
                                textAnchor="middle"
                                fill="currentColor"
                                fontSize="7"
                                fontWeight="bold"
                            >
                                10
                            </text>
                        </svg>
                    </button>

                    {/* Volume */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMuted((m) => !m);
                        }}
                        className="rounded p-1 hover:bg-white/20"
                        title="Mute (m)"
                    >
                        {volumeIcon()}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        onClick={(e) => e.stopPropagation()}
                        className="hidden h-1 w-16 cursor-pointer accent-white sm:block"
                        title="Volume"
                    />

                    {/* Time */}
                    <span className="ml-1 select-none text-xs tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div className="flex-1" />

                    {/* Playback speed */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowRateMenu((s) => !s);
                            }}
                            className="rounded px-2 py-0.5 text-xs font-semibold hover:bg-white/20"
                            title="Playback speed"
                        >
                            {playbackRate}x
                        </button>
                        {showRateMenu && (
                            <div className="absolute bottom-full right-0 mb-2 rounded-lg bg-gray-900/95 py-1 shadow-lg backdrop-blur-sm">
                                {PLAYBACK_RATES.map((rate) => (
                                    <button
                                        key={rate}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            selectRate(rate);
                                        }}
                                        className={`block w-full px-4 py-1.5 text-left text-xs hover:bg-white/10 ${
                                            rate === playbackRate
                                                ? "font-bold text-red-400"
                                                : "text-white"
                                        }`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Fullscreen */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFullscreen();
                        }}
                        className="rounded p-1 hover:bg-white/20"
                        title="Fullscreen (f)"
                    >
                        {isFullscreen ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
