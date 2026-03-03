import { useInstructorsQuery } from "../../instructors/hooks";

interface InstructorSelectorProps {
    value: string;
    onChange: (instructorId: string) => void;
    error?: string;
}

const InstructorSelector = ({
    value,
    onChange,
    error,
}: InstructorSelectorProps) => {
    const { data: instructors = [], isLoading } = useInstructorsQuery();

    const activeInstructors = instructors.filter((i) => i.status === "ACTIVE");

    return (
        <div>
            <label
                htmlFor="instructorId"
                className="mb-1 block text-sm font-medium text-gray-700"
            >
                Instructor
            </label>
            <select
                id="instructorId"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
            >
                <option value="">-- Select Instructor --</option>
                {activeInstructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            {isLoading && (
                <p className="mt-1 text-xs text-gray-500">
                    Loading instructors...
                </p>
            )}
        </div>
    );
};

export default InstructorSelector;
