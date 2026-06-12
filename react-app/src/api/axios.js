import axios from "axios";

const customAxios = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// Auto-attach access token
customAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    
    // 🚨 ADD THESE TWO LINES TO DEBUG:
    console.log("Interceptor is running!");
    console.log("Token found in storage:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh token on 401
customAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");
                
                const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
                    refresh: refreshToken,
                });

                localStorage.setItem("access", response.data.access);

                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return customAxios(originalRequest);
                
            } catch (refreshError) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = '/login'; 
            }
        }
        
        return Promise.reject(error);
    }
);

export default customAxios;