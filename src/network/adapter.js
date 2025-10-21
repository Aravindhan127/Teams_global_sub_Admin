import axios from 'axios';
import authConfig from "src/configs/auth"
import { toast } from "react-hot-toast"
import { PublicRoutes } from 'src/utils/constants';

export const axiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem(authConfig.storageTokenKeyName)}`,
    },
});

// You can set default headers like Content-Type here
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

// Add a request interceptor to set the authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage and set the authorization header
        const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
        if (token) {
            config.headers['authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add an interceptor to handle 401 responses - Invalid/Expired token
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Handle the 401 response here, e.g., by redirecting to a login page
            // You can also clear the token from localStorage if needed
            window.localStorage.removeItem(authConfig.storageUserDataKeyName);
            window.localStorage.removeItem(authConfig.storageTokenKeyName);
            if (!PublicRoutes.includes(window.location.pathname)) {
                toast.error('Session expired. Please log in again.');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// access token ->  8hr
// refresh token -> 90 days

