import { useDashboardStatsQuery } from "../dashboard/hooks";
import type { DashboardStats } from "../dashboard/types";

// ─── Stat Card ───────────────────────────────────────────────
interface StatCardProps {
    label: string;
    value: number;
    sub?: string;
    color: string;
    icon: string;
}

const StatCard = ({ label, value, sub, color, icon }: StatCardProps) => (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                    {value.toLocaleString()}
                </p>
                {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
            </div>
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${color}`}
            >
                {icon}
            </div>
        </div>
    </div>
);

// ─── Section Header ──────────────────────────────────────────
const SectionHeader = ({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) => (
    <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
);

// ─── Badge ───────────────────────────────────────────────────
const Badge = ({
    text,
    variant,
}: {
    text: string;
    variant: "green" | "blue" | "yellow" | "red" | "gray";
}) => {
    const styles = {
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        yellow: "bg-yellow-100 text-yellow-700",
        red: "bg-red-100 text-red-700",
        gray: "bg-gray-100 text-gray-700",
    };
    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
        >
            {text}
        </span>
    );
};

const roleBadgeVariant = (role: string) => {
    if (role === "SUPER_ADMIN") return "red";
    if (role === "ADMIN") return "blue";
    return "gray";
};

const statusBadgeVariant = (status: string) => {
    if (status === "ACTIVE") return "green";
    if (status === "COMPLETED") return "blue";
    return "yellow";
};

// ─── Dashboard Content ──────────────────────────────────────
const DashboardContent = ({ stats }: { stats: DashboardStats }) => (
    <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Total Users"
                value={stats.users.total}
                sub={`${stats.users.students} students · ${stats.users.admins} admins`}
                color="bg-blue-50 text-blue-600"
                icon="👥"
            />
            <StatCard
                label="Published Courses"
                value={stats.courses.published}
                sub={`${stats.courses.draft} drafts · ${stats.courses.total} total`}
                color="bg-indigo-50 text-indigo-600"
                icon="📚"
            />
            <StatCard
                label="Active Enrollments"
                value={stats.enrollments.active}
                sub={`${stats.enrollments.total} total enrollments`}
                color="bg-green-50 text-green-600"
                icon="🎓"
            />
            <StatCard
                label="Pending Requests"
                value={stats.enrollmentRequests.pending}
                sub={`${stats.enrollmentRequests.approved} approved · ${stats.enrollmentRequests.rejected} rejected`}
                color="bg-yellow-50 text-yellow-600"
                icon="📋"
            />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Published Blogs"
                value={stats.blogs.published}
                sub={`${stats.blogs.total} total blogs`}
                color="bg-pink-50 text-pink-600"
                icon="✍️"
            />
            <StatCard
                label="Published Webinars"
                value={stats.webinars.published}
                sub={`${stats.webinars.total} total webinars`}
                color="bg-purple-50 text-purple-600"
                icon="🎥"
            />
            <StatCard
                label="Webinar Registrations"
                value={stats.webinars.registrations}
                color="bg-teal-50 text-teal-600"
                icon="📝"
            />
            <StatCard
                label="Course Content"
                value={stats.content.lessons}
                sub={`${stats.content.modules} modules · ${stats.content.lessons} lessons`}
                color="bg-orange-50 text-orange-600"
                icon="📖"
            />
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Users */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
                <SectionHeader
                    title="Recent Users"
                    subtitle="Last 5 registered users"
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-gray-500">
                                <th className="pb-2 font-medium">Name</th>
                                <th className="pb-2 font-medium">Email</th>
                                <th className="pb-2 font-medium">Role</th>
                                <th className="pb-2 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {stats.recentUsers.map((u) => (
                                <tr key={u.id}>
                                    <td className="py-2 font-medium text-gray-900">
                                        {u.name}
                                    </td>
                                    <td className="py-2 text-gray-600">
                                        {u.email}
                                    </td>
                                    <td className="py-2">
                                        <Badge
                                            text={u.role}
                                            variant={roleBadgeVariant(u.role)}
                                        />
                                    </td>
                                    <td className="py-2 text-gray-500">
                                        {new Date(
                                            u.createdAt,
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Enrollments */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
                <SectionHeader
                    title="Recent Enrollments"
                    subtitle="Last 5 enrollments"
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-gray-500">
                                <th className="pb-2 font-medium">Student</th>
                                <th className="pb-2 font-medium">Course</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {stats.recentEnrollments.map((e) => (
                                <tr key={e.id}>
                                    <td className="py-2 font-medium text-gray-900">
                                        {e.user.name}
                                    </td>
                                    <td className="py-2 text-gray-600 max-w-[180px] truncate">
                                        {e.course.title}
                                    </td>
                                    <td className="py-2">
                                        <Badge
                                            text={e.status}
                                            variant={statusBadgeVariant(
                                                e.status,
                                            )}
                                        />
                                    </td>
                                    <td className="py-2 text-gray-500">
                                        {new Date(
                                            e.createdAt,
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Enrollment Requests Breakdown */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <SectionHeader
                title="Enrollment Requests Overview"
                subtitle="Breakdown by status"
            />
            <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-yellow-50 p-4">
                    <p className="text-2xl font-bold text-yellow-700">
                        {stats.enrollmentRequests.pending}
                    </p>
                    <p className="text-sm text-yellow-600">Pending</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-2xl font-bold text-green-700">
                        {stats.enrollmentRequests.approved}
                    </p>
                    <p className="text-sm text-green-600">Approved</p>
                </div>
                <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-2xl font-bold text-red-700">
                        {stats.enrollmentRequests.rejected}
                    </p>
                    <p className="text-sm text-red-600">Rejected</p>
                </div>
            </div>
        </div>
    </div>
);

// ─── Main Component ──────────────────────────────────────────
const AdminDashboard = () => {
    const { data: stats, isLoading, isError } = useDashboardStatsQuery();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                </div>
            )}

            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Failed to load dashboard statistics. Please try again.
                </div>
            )}

            {stats && <DashboardContent stats={stats} />}
        </div>
    );
};

export default AdminDashboard;
