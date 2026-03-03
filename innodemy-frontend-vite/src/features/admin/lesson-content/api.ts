import api from "../../../api/axios";
import type {
    AdminLessonContent,
    LessonContentBlock,
    UpdateLessonContentPayload,
} from "./types";

interface SuccessResponse<T> {
    success: boolean;
    data: T;
}

export const lessonContentApi = {
    getLessonById: async (lessonId: string): Promise<AdminLessonContent> => {
        const { data } = await api.get<SuccessResponse<AdminLessonContent>>(
            `/lessons/${lessonId}`,
        );
        return data.data;
    },

    updateLessonContent: async (
        lessonId: string,
        content: LessonContentBlock[],
    ): Promise<AdminLessonContent> => {
        const payload: UpdateLessonContentPayload = { content };
        const { data } = await api.patch<SuccessResponse<AdminLessonContent>>(
            `/lessons/${lessonId}`,
            payload,
        );
        return data.data;
    },
};
