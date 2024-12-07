// axiosConfig.ts
import axios, {  AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api', // Set the base URL
    timeout: 10000, // Set the timeout for requests
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {  // Use InternalAxiosRequestConfig here
        // Add authorization token to headers if present in local storage (or any other storage method)
        const token = localStorage.getItem('authToken');
        if (token) {
            // TypeScript will now understand that we are modifying the headers correctly
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('Request Sent:', config); // For debugging purposes (you can remove this in production)

        return config;
    },
    (error: AxiosError) => {
        // Handle the request error globally (for instance, showing a toast notification)
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // You can handle the response globally (e.g., logging, or formatting data)
        console.log('Response Received:', response); // For debugging purposes

        return response;
    },
    (error: AxiosError) => {
        // Global error handling for the response
        if (error.response) {
            // The request was made, but the server responded with an error status code
            console.error('Response Error Status:', error.response.status);
            console.error('Response Error Data:', error.response.data);

            // For example, handling 401 Unauthorized (token expired or invalid)
            if (error.response.status === 401) {
                // Handle 401 error (e.g., redirect to login page, or refresh token)
                console.log('Unauthorized, please login again!');
            }
        } else if (error.request) {
            // The request was made, but no response was received
            console.error('Request Error No Response:', error.request);
        } else {
            // Something went wrong in setting up the request
            console.error('Error in setting up request:', error.message);
        }

        // Optionally, you could dispatch an error action if you're using Redux or a state management library
        return Promise.reject(error);
    }
);

export default axiosInstance;
