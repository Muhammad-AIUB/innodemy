import { useMutation } from "@tanstack/react-query";
import { uploadImage, uploadVideo } from "./api";

export const useUploadImageMutation = () => {
    return useMutation({
        mutationFn: uploadImage,
    });
};

export const useUploadVideoMutation = () => {
    return useMutation({
        mutationFn: uploadVideo,
    });
};
