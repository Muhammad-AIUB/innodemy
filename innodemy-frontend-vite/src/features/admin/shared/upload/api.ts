import axios from "axios";

const uploadApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Attach token from auth store
uploadApi.interceptors.request.use((config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
        }
    }
    return config;
});

export interface UploadResponse {
    success: boolean;
    data: {
        url: string;
        filename: string;
        size: number;
    };
}

/**
 * Upload image file
 * POST /api/v1/upload/image
 * Max size: 5MB
 * Allowed: JPEG, PNG, WEBP
 */
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadApi.post<UploadResponse>(
        "/upload/image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    // Return relative path — served via Vite proxy in dev, same domain in prod
    return response.data.data.url;
};

/**
 * Upload video file
 * POST /api/v1/upload/video
 * Max size: 100MB
 * Allowed: MP4, WEBM, OGG
 */
export const uploadVideo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadApi.post<UploadResponse>(
        "/upload/video",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    // Return relative path — served via Vite proxy in dev, same domain in prod
    return response.data.data.url;
};
