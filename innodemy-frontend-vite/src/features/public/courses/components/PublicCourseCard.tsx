import { Link } from "react-router-dom";
import type { PublicCourse } from "../types";

interface PublicCourseCardProps {
    course: PublicCourse;
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const PublicCourseCard = ({ course }: PublicCourseCardProps) => {
    const hasDiscount =
        course.discountPrice !== null && course.discountPrice < course.price;
    const displayPrice = hasDiscount ? course.discountPrice! : course.price;

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
            {/* Banner Image */}
            {course.bannerImage && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                        src={course.bannerImage}
                        alt={course.title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            <div className="p-5">
                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {course.title}
                </h3>

                {/* Description */}
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                    {course.description}
                </p>

                {/* Course Stats */}
                <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>📚 {course.totalModules} modules</span>
                    <span>⏱️ {course.duration}h</span>
                    <span>📅 {formatDate(course.startDate)}</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                    <div>
                        {hasDiscount ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                    {formatPrice(displayPrice)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(course.price)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                                {formatPrice(displayPrice)}
                            </span>
                        )}
                    </div>

                    <Link
                        to={`/courses/${course.slug}`}
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PublicCourseCard;
