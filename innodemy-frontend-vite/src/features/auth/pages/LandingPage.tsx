import { useCallback, useState } from "react";
import AuthSidebar from "../sidebar/AuthSidebar";

const LandingPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    return (
        <div className="min-h-screen">
            {/* Minimal header */}
            <header className="flex items-center justify-between border-b px-6 py-4">
                <h1 className="text-xl font-bold">Innodemy</h1>
                <button
                    onClick={openSidebar}
                    className="rounded bg-black px-4 py-2 text-white"
                    type="button"
                >
                    Sign In / Register
                </button>
            </header>

            {/* Placeholder content */}
            <main className="flex min-h-[80vh] flex-col items-center justify-center px-6">
                <h2 className="text-3xl font-bold">Welcome to Innodemy LMS</h2>
                <p className="mt-2 text-gray-600">
                    Your learning management platform.
                </p>
            </main>

            {/* Auth Sidebar */}
            <AuthSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </div>
    );
};

export default LandingPage;
