import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { normalizeApiError } from "./error";

// Append /api/v1 to VITE_API_URL (e.g. http://localhost:5000 -> http://localhost:5000/api/v1)
const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "").replace(/\/api\/v1\/?$/, "");
const baseURL = `${baseUrl}/api/v1`;

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = "/";
        }

        // Normalize all API errors into a predictable AppError shape
        // so React Query hooks and components never see raw AxiosErrors.
        return Promise.reject(normalizeApiError(error));
    },
);

export default api;
