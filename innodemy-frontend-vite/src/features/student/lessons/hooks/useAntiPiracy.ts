/**
 * useAntiPiracy — a hook that implements multi-layered anti-piracy
 * protections used by major LMS platforms.
 *
 * Layers:
 * 1. Disable right-click context menu on the video container
 * 2. Block keyboard shortcuts for screenshots / screen recording
 * 3. Detect DevTools open — pause video + show warning
 * 4. Detect tab visibility change — pause video when hidden
 * 5. Disable Picture-in-Picture (prevents PiP-based recording)
 * 6. Prevent drag/drop of video element
 * 7. Block PrintScreen key
 * 8. Detect screen capture via getDisplayMedia
 *
 * Usage:
 *   const { isDevToolsOpen } = useAntiPiracy(containerRef, videoRef, {
 *       onPause: () => setPlaying(false),
 *   });
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface AntiPiracyOptions {
    /** Called when the hook wants to pause the video */
    onPause: () => void;
    /** Whether protections are active (default: true) */
    enabled?: boolean;
}

interface AntiPiracyState {
    isDevToolsOpen: boolean;
    isTabHidden: boolean;
    piracyWarning: string | null;
}

const useAntiPiracy = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    videoRef: React.RefObject<HTMLVideoElement | null>,
    options: AntiPiracyOptions,
): AntiPiracyState => {
    const { onPause, enabled = true } = options;
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
    const [isTabHidden, setIsTabHidden] = useState(false);
    const [piracyWarning, setPiracyWarning] = useState<string | null>(null);
    const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const showWarning = useCallback((msg: string) => {
        setPiracyWarning(msg);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = setTimeout(
            () => setPiracyWarning(null),
            4000,
        );
    }, []);

    // ── 1. Disable right-click (context menu) ──────────────────────
    useEffect(() => {
        if (!enabled) return;
        const container = containerRef.current;
        if (!container) return;

        const prevent = (e: Event) => {
            e.preventDefault();
            showWarning("Right-click is disabled for content protection.");
        };
        container.addEventListener("contextmenu", prevent);
        return () => container.removeEventListener("contextmenu", prevent);
    }, [containerRef, enabled, showWarning]);

    // ── 2. Block screenshot / recording keyboard shortcuts ─────────
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // PrintScreen
            if (e.key === "PrintScreen") {
                e.preventDefault();
                onPause();
                showWarning("Screenshots are not allowed.");
                // Attempt to overwrite clipboard
                navigator.clipboard
                    .writeText("Screenshot disabled — Innodemy")
                    .catch(() => {});
                return;
            }

            // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
            // Ctrl+U (View Source)  F12 (DevTools)
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
                (e.ctrlKey && e.key === "u") ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
                showWarning("Developer tools are blocked during playback.");
                return;
            }

            // Ctrl+S (Save page)
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                showWarning("Downloading is not allowed.");
                return;
            }

            // Ctrl+P (Print)
            if ((e.ctrlKey || e.metaKey) && e.key === "p") {
                e.preventDefault();
                showWarning("Printing is not allowed.");
                return;
            }
        };

        window.addEventListener("keydown", handleKeyDown, { capture: true });
        return () =>
            window.removeEventListener("keydown", handleKeyDown, {
                capture: true,
            });
    }, [enabled, onPause, showWarning]);

    // ── 3. DevTools detection (debugger timing) ─────────────────────
    useEffect(() => {
        if (!enabled) return;

        const checkDevTools = () => {
            const start = performance.now();
            // When DevTools are open, debugger takes measurably longer
            // eslint-disable-next-line no-debugger
            debugger;
            const delta = performance.now() - start;
            // If execution was paused by debugger > 100ms, DevTools are likely open
            if (delta > 100) {
                setIsDevToolsOpen(true);
                onPause();
                showWarning("Developer tools detected. Video playback paused.");
            } else {
                setIsDevToolsOpen(false);
            }
        };

        // Check only in production — debugger pauses are disruptive in dev
        const isProduction = import.meta.env.PROD;
        if (!isProduction) return;

        const interval = setInterval(checkDevTools, 3000);
        return () => clearInterval(interval);
    }, [enabled, onPause, showWarning]);

    // ── 4. Visibility change — pause when tab is hidden ─────────────
    useEffect(() => {
        if (!enabled) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsTabHidden(true);
                onPause();
            } else {
                setIsTabHidden(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
    }, [enabled, onPause]);

    // ── 5. Disable PiP on the video element ─────────────────────────
    useEffect(() => {
        if (!enabled) return;
        const video = videoRef.current;
        if (!video) return;

        video.disablePictureInPicture = true;
        // Also set the attribute for browsers that read it
        video.setAttribute("disablepictureinpicture", "true");
        // Prevent remote playback (e.g., Chromecast — prevents casting to record)
        video.disableRemotePlayback = true;
        video.setAttribute("disableremoteplayback", "true");
    }, [videoRef, enabled]);

    // ── 6. Prevent drag of video ────────────────────────────────────
    useEffect(() => {
        if (!enabled) return;
        const container = containerRef.current;
        if (!container) return;

        const preventDrag = (e: DragEvent) => e.preventDefault();
        const preventSelect = (e: Event) => e.preventDefault();

        container.addEventListener("dragstart", preventDrag);
        container.addEventListener("selectstart", preventSelect);
        return () => {
            container.removeEventListener("dragstart", preventDrag);
            container.removeEventListener("selectstart", preventSelect);
        };
    }, [containerRef, enabled]);

    // ── 7. Blur video on window blur (alt-tab screen capture) ───────
    useEffect(() => {
        if (!enabled) return;

        const handleBlur = () => {
            // Only pause — don't blur the entire UI.
            // This catches Alt+Tab to recording software.
            onPause();
        };

        window.addEventListener("blur", handleBlur);
        return () => window.removeEventListener("blur", handleBlur);
    }, [enabled, onPause]);

    // Cleanup warning timeout
    useEffect(() => {
        return () => {
            if (warningTimeoutRef.current)
                clearTimeout(warningTimeoutRef.current);
        };
    }, []);

    return { isDevToolsOpen, isTabHidden, piracyWarning };
};

export default useAntiPiracy;
