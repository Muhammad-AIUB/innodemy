interface CourseProgressBarProps {
    percentage: number;
}

const CourseProgressBar = ({ percentage }: CourseProgressBarProps) => {
    const clamped = Math.min(100, Math.max(0, percentage));

    return (
        <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
                className="h-2.5 rounded-full bg-black"
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
};

export default CourseProgressBar;
