import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const SuperAdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    const navLinkClass = (path: string) => {
        const base = "block rounded px-4 py-2 text-sm transition-colors";
        return isActive(path)
            ? `${base} bg-blue-100 text-blue-700 font-medium`
            : `${base} text-gray-700 hover:bg-gray-100`;
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col border-r bg-white shadow-sm">
                <div className="p-4 text-lg font-bold text-gray-900">
                    Super Admin
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    <Link
                        to="/super-admin/dashboard"
                        className={navLinkClass("/super-admin/dashboard")}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/super-admin/courses"
                        className={navLinkClass("/super-admin/courses")}
                    >
                        Courses
                    </Link>
                    <Link
                        to="/super-admin/webinars"
                        className={navLinkClass("/super-admin/webinars")}
                    >
                        Webinars
                    </Link>
                    <Link
                        to="/super-admin/blogs"
                        className={navLinkClass("/super-admin/blogs")}
                    >
                        Blogs
                    </Link>
                    <Link
                        to="/super-admin/enrollment-requests"
                        className={navLinkClass(
                            "/super-admin/enrollment-requests",
                        )}
                    >
                        Enrollment Requests
                    </Link>
                    <Link
                        to="/super-admin/webinar-registrations"
                        className={navLinkClass(
                            "/super-admin/webinar-registrations",
                        )}
                    >
                        Webinar Registrations
                    </Link>
                    <Link
                        to="/super-admin/users"
                        className={navLinkClass("/super-admin/users")}
                    >
                        Users
                    </Link>
                </nav>
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex h-16 items-center border-b bg-white px-6">
                    <span className="text-sm font-medium text-gray-700">
                        Super Admin Portal
                    </span>
                </header>

                {/* Page content */}
                <main className="flex-1 bg-gray-50 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
