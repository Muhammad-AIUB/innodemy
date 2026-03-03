/**
 * Normalizes an image/file URL to a relative path.
 *
 * - If the URL is already relative (starts with /), returns as-is.
 * - If the URL is a full backend URL (http://localhost:5000/uploads/...),
 *   strips the origin to produce a relative path.
 * - External URLs (https://...) are returned unchanged.
 */
const getImageUrl = (url: string | undefined | null): string => {
    if (!url) return "";

    // Already relative
    if (url.startsWith("/")) return url;

    // External URL (not our backend) — keep as-is
    try {
        const parsed = new URL(url);
        // If path starts with /uploads, convert to relative
        if (parsed.pathname.startsWith("/uploads")) {
            return parsed.pathname;
        }
    } catch {
        // Invalid URL — return as-is
    }

    return url;
};

export default getImageUrl;
