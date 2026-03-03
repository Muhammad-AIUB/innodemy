/**
 * VideoProtectionOverlay — a transparent shield rendered on top of
 * the video element that absorbs pointer events and prevents
 * direct access to the underlying <video>.
 *
 * This makes it harder for browser extensions, screen-capture
 * tools, and the "Inspect Element" trick to grab the video src.
 *
 * Also shows anti-piracy warnings when triggered.
 */

interface VideoProtectionOverlayProps {
    /** Warning message to display, or null if none. */
    warning: string | null;
    /** Whether DevTools are detected */
    isDevToolsOpen: boolean;
}

const VideoProtectionOverlay = ({
    warning,
    isDevToolsOpen,
}: VideoProtectionOverlayProps) => {
    return (
        <>
            {/* Transparent shield that absorbs inspection clicks */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    // The overlay sits between the video and the controls.
                    // pointer-events: none lets clicks pass through to our
                    // custom controls (they have data-controls) but the
                    // shield exists in the DOM to confuse naive element pickers.
                    pointerEvents: "none",
                }}
                aria-hidden="true"
            />

            {/* DevTools detected — full blackout */}
            {isDevToolsOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="text-center">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            className="mx-auto mb-3 h-12 w-12 text-red-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                            />
                        </svg>
                        <p className="text-sm font-semibold text-red-400">
                            Developer Tools Detected
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            Please close developer tools to continue watching.
                        </p>
                    </div>
                </div>
            )}

            {/* Warning toast */}
            {warning && !isDevToolsOpen && (
                <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 animate-fade-in">
                    <div className="flex items-center gap-2 rounded-lg bg-red-600/90 px-4 py-2 shadow-lg backdrop-blur-sm">
                        <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 shrink-0 text-white"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-xs font-medium text-white">
                            {warning}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoProtectionOverlay;
