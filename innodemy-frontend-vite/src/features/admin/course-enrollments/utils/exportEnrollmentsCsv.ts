import type { CourseEnrollment } from "../types";

const CSV_HEADERS = [
    "Name",
    "Email",
    "Enrolled At",
    "Completed Lessons",
    "Total Lessons",
    "Progress %",
];

interface ExportEnrollmentsCsvOptions {
    courseTitle: string;
    filterMode: string;
}

const escapeCsvValue = (value: string | number): string => {
    const stringValue = String(value);
    const escapedValue = stringValue.replace(/"/g, "\"\"");

    if (/[",\n\r]/.test(escapedValue)) {
        return `"${escapedValue}"`;
    }

    return escapedValue;
};

const formatCsvDate = (value: Date): string => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const exportEnrollmentsCsv = (
    enrollments: CourseEnrollment[],
    options: ExportEnrollmentsCsvOptions,
): void => {
    const metadataRows = [
        escapeCsvValue(`Course: ${options.courseTitle}`),
        escapeCsvValue(`Filter: ${options.filterMode}`),
        escapeCsvValue(`Exported At: ${new Date().toLocaleString()}`),
    ];

    const rows = enrollments.map((enrollment) =>
        [
            enrollment.name,
            enrollment.email,
            enrollment.enrolledAt,
            enrollment.completedLessons,
            enrollment.totalLessons,
            enrollment.progressPercentage,
        ]
            .map((field) => escapeCsvValue(field))
            .join(","),
    );

    const csvContent = [
        ...metadataRows,
        "",
        CSV_HEADERS.join(","),
        ...rows,
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `course-enrollments-${formatCsvDate(new Date())}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
