import { Link } from "react-router-dom";
import type { Course } from "../types";
import getImageUrl from "../../../shared/utils/getImageUrl";

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <Link
            to={`/app/courses/${course.slug}`}
            className="block rounded border p-4"
        >
            {course.bannerImage && (
                <img
                    src={getImageUrl(course.bannerImage)}
                    alt={course.title}
                    className="mb-3 h-40 w-full rounded object-cover"
                />
            )}
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{course.description}</p>
            <div className="mt-2 text-sm text-gray-500">
                {course.discountPrice != null ? (
                    <>
                        <span className="line-through">৳{course.price}</span>{" "}
                        <span className="font-medium text-black">
                            ৳{course.discountPrice}
                        </span>
                    </>
                ) : (
                    <span>৳{course.price}</span>
                )}
            </div>
        </Link>
    );
};

export default CourseCard;
