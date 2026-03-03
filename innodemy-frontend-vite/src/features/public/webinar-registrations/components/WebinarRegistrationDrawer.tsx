import { useState } from "react";
import { useRegisterWebinarMutation } from "../hooks";

interface WebinarRegistrationDrawerProps {
    webinarId: string;
    isOpen: boolean;
    onClose: () => void;
}

const WebinarRegistrationDrawer = ({
    webinarId,
    isOpen,
    onClose,
}: WebinarRegistrationDrawerProps) => {
    const mutation = useRegisterWebinarMutation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(
            { webinarId, name, email, phone },
            {
                onSuccess: () => {
                    alert("Registered successfully!");
                    setName("");
                    setEmail("");
                    setPhone("");
                    onClose();
                },
            },
        );
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/30"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Register for Webinar
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {mutation.error && (
                    <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                        {mutation.error.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="reg-name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            id="reg-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="reg-email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="reg-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="reg-phone"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Phone
                        </label>
                        <input
                            id="reg-phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="+8801712345678"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {mutation.isPending
                            ? "Registering..."
                            : "Register Free"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default WebinarRegistrationDrawer;
