import { useEffect, useRef } from "react";
import type { CourseProgressResponse } from "../types";
import isCourseCompleted from "../utils/isCourseCompleted";

const useCourseCompletionEffect = (
    courseId: string,
    progress?: CourseProgressResponse | null,
) => {
    const activeCourseIdRef = useRef<string>("");
    const hasInitializedRef = useRef(false);
    const previousCompletedRef = useRef(false);
    const hasFiredRef = useRef(false);

    useEffect(() => {
        if (!courseId) {
            return;
        }

        if (activeCourseIdRef.current !== courseId) {
            activeCourseIdRef.current = courseId;
            hasInitializedRef.current = false;
            previousCompletedRef.current = false;
            hasFiredRef.current = false;
        }

        if (!progress) {
            return;
        }

        const currentCompleted = isCourseCompleted(progress);

        if (!hasInitializedRef.current) {
            hasInitializedRef.current = true;
            previousCompletedRef.current = currentCompleted;
            if (currentCompleted) {
                hasFiredRef.current = true;
            }
            return;
        }

        const hasTransitionedToCompleted =
            !previousCompletedRef.current && currentCompleted;

        if (hasTransitionedToCompleted && !hasFiredRef.current) {
            alert("🎉 Course completed!");
            // Placeholder for future completion recording/certificate flow.
            hasFiredRef.current = true;
        }

        previousCompletedRef.current = currentCompleted;
    }, [courseId, progress]);
};

export default useCourseCompletionEffect;
