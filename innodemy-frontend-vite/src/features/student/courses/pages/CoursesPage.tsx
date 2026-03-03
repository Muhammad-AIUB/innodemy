import { useCoursesQuery } from "../hooks";
import CourseCard from "../components/CourseCard";

const CoursesPage = () => {
    const { data, isLoading, isError } = useCoursesQuery();

    if (isLoading) {
        return <p>Loading courses...</p>;
    }

    if (isError) {
        return <p className="text-red-600">Failed to load courses.</p>;
    }

    const courses = data?.data ?? [];

    if (courses.length === 0) {
        return <p>No courses available.</p>;
    }

    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">Courses</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.slug} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CoursesPage;
