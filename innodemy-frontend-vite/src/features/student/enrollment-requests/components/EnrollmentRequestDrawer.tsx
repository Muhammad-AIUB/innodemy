import { useState, useRef } from "react";
import { useApiError } from "../../../../hooks/useApiError";
import { useCreateEnrollmentRequestMutation } from "../hooks";

interface EnrollmentRequestDrawerProps {
    courseId: string;
    isOpen: boolean;
    onClose: () => void;
}

const PAYMENT_METHODS = [
    { value: "bkash", label: "bKash" },
    { value: "nagad", label: "Nagad" },
    { value: "bank", label: "Bank Transfer" },
] as const;

const EnrollmentRequestDrawer = ({
    courseId,
    isOpen,
    onClose,
}: EnrollmentRequestDrawerProps) => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotUrl, setScreenshotUrl] = useState("");
    const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { getErrorMessage } = useApiError();

    const mutation = useCreateEnrollmentRequestMutation();

    const isFormValid =
        paymentMethod.trim() !== "" &&
        transactionId.trim() !== "" &&
        (uploadMode === "file"
            ? screenshotFile !== null
            : screenshotUrl.trim() !== "");

    const resetForm = () => {
        setPaymentMethod("");
        setTransactionId("");
        setScreenshotFile(null);
        setScreenshotUrl("");
        setUploadMode("url");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
            alert("File size exceeds 5MB limit");
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
            return;
        }

        setScreenshotFile(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid || mutation.isPending) return;

        // Send everything in one request — file is uploaded atomically with enrollment
        mutation.mutate(
            {
                courseId,
                paymentMethod,
                transactionId: transactionId.trim(),
                ...(uploadMode === "file" && screenshotFile
                    ? { screenshotFile }
                    : { screenshotUrl: screenshotUrl.trim() }),
            },
            {
                onSuccess: () => {
                    alert("Request submitted. Await admin approval.");
                    resetForm();
                    onClose();
                },
            },
        );
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Submit Payment
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col gap-5 overflow-y-auto p-6"
                >
                    {/* Payment Method */}
                    <div>
                        <label
                            htmlFor="paymentMethod"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Payment Method
                        </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        >
                            <option value="">Select method</option>
                            {PAYMENT_METHODS.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Transaction ID */}
                    <div>
                        <label
                            htmlFor="transactionId"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Transaction ID
                        </label>
                        <input
                            id="transactionId"
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter your transaction ID"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                    </div>

                    {/* Payment Screenshot */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Payment Screenshot
                        </label>

                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setUploadMode("url");
                                    setScreenshotFile(null);
                                }}
                                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                                    uploadMode === "url"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                URL
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setUploadMode("file");
                                    setScreenshotUrl("");
                                }}
                                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                                    uploadMode === "file"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Upload File
                            </button>
                        </div>

                        {/* URL Input Mode */}
                        {uploadMode === "url" && (
                            <input
                                type="url"
                                value={screenshotUrl}
                                onChange={(e) =>
                                    setScreenshotUrl(e.target.value)
                                }
                                placeholder="https://example.com/screenshot.jpg"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            />
                        )}

                        {/* File Upload Mode */}
                        {uploadMode === "file" && (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={screenshotFile?.name || ""}
                                        readOnly
                                        placeholder="No file selected"
                                        className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                    >
                                        Browse
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <p className="text-xs text-gray-500">
                                    Max size: 5MB. Accepted: JPEG, PNG, WEBP
                                </p>

                                {/* Preview */}
                                {screenshotFile && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(
                                                screenshotFile,
                                            )}
                                            alt="Preview"
                                            className="h-32 w-auto rounded border border-gray-200 object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Error message */}
                    {mutation.isError && (
                        <p className="text-sm text-red-600">
                            {getErrorMessage(mutation.error)}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isFormValid || mutation.isPending}
                        className="mt-auto rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {mutation.isPending
                            ? "Submitting..."
                            : "Submit Payment"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default EnrollmentRequestDrawer;
