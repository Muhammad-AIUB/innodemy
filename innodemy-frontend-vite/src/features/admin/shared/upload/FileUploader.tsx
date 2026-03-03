import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { useUploadImageMutation, useUploadVideoMutation } from "./hooks";
import getImageUrl from "../../../shared/utils/getImageUrl";

interface FileUploaderProps {
    /**
     * Current value (URL or file path)
     */
    value: string;

    /**
     * Callback when value changes (either from URL input or file upload)
     */
    onChange: (value: string) => void;

    /**
     * File type: image or video
     */
    type?: "image" | "video";

    /**
     * Label for the input
     */
    label?: string;

    /**
     * Show validation error
     */
    error?: string;

    /**
     * Max file size in MB
     */
    maxSizeMB?: number;

    /**
     * Accept attribute for file input
     */
    accept?: string;
}

/**
 * Reusable file uploader component
 * Supports both:
 * 1. Direct file upload → upload to server
 * 2. URL input → use external URL
 */
const FileUploader = ({
    value,
    onChange,
    type = "image",
    label = "File",
    error,
    maxSizeMB = type === "image" ? 5 : 100,
    accept = type === "image"
        ? "image/jpeg,image/jpg,image/png,image/webp"
        : "video/mp4,video/webm,video/ogg",
}: FileUploaderProps) => {
    const [mode, setMode] = useState<"url" | "file">("url");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadImageMutation = useUploadImageMutation();
    const uploadVideoMutation = useUploadVideoMutation();

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            setUploadError(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }

        setUploadError("");
        setUploading(true);

        try {
            const uploadMutation =
                type === "video" ? uploadVideoMutation : uploadImageMutation;
            const url = await uploadMutation.mutateAsync(file);
            onChange(url);
        } catch (err) {
            setUploadError(
                err instanceof Error ? err.message : "Upload failed",
            );
        } finally {
            setUploading(false);
        }
    };

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => setMode("url")}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        mode === "url"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    URL
                </button>
                <button
                    type="button"
                    onClick={() => setMode("file")}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        mode === "file"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Upload File
                </button>
            </div>

            {/* URL Input Mode */}
            {mode === "url" && (
                <input
                    type="url"
                    value={value}
                    onChange={handleUrlChange}
                    placeholder={`https://example.com/${type}.${type === "image" ? "jpg" : "mp4"}`}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
            )}

            {/* File Upload Mode */}
            {mode === "file" && (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={value}
                            readOnly
                            placeholder="No file selected"
                            className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                        />
                        <button
                            type="button"
                            onClick={handleBrowseClick}
                            disabled={uploading}
                            className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {uploading ? "Uploading..." : "Browse"}
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <p className="text-xs text-gray-500">
                        Max size: {maxSizeMB}MB. Accepted:{" "}
                        {accept
                            .split(",")
                            .map((a) => a.split("/")[1])
                            .join(", ")}
                    </p>
                </div>
            )}

            {/* Preview */}
            {value && type === "image" && (
                <div className="mt-2">
                    <img
                        src={getImageUrl(value)}
                        alt="Preview"
                        className="h-32 w-auto rounded border border-gray-200 object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                </div>
            )}

            {/* Errors */}
            {(error || uploadError) && (
                <p className="text-xs text-red-600">{error || uploadError}</p>
            )}
        </div>
    );
};

export default FileUploader;
