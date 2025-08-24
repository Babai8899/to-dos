import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://to-dos-server-five.vercel.app/api',
    // baseURL: 'http://localhost:5001/api',
    withCredentials: true, // send cookies with each request
    
});

// Refresh token interceptor
axiosInstance.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth')
        ) {
            originalRequest._retry = true;
            try {
                await axiosInstance.get('/auth/refresh'); // hit refresh endpoint
                return axiosInstance(originalRequest); // retry original request
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;