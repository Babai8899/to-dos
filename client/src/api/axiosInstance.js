import axios from 'axios';

// Use REACT_APP_ENV for environment detection (set in .env file)
const ENV = import.meta.env.VITE_ENV;
console.log('Current Environment:', ENV);

let baseURL;
if (ENV === 'development') {
    baseURL = 'http://localhost:5001/api';
} else {
    baseURL = 'https://to-dos-server-five.vercel.app/api';
}

const axiosInstance = axios.create({
        baseURL,
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