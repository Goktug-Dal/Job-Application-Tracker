import axios from "axios";
import { API_BASE_URL } from "./config";

const customAxios = axios.create({
    baseURL: API_BASE_URL,
});

customAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) throw new Error("No refresh token available");

                const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                    refresh: refreshToken,
                });

                localStorage.setItem("access", response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return customAxios(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default customAxios;