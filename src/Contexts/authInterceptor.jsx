import axios from 'axios';
import { BASE_URL } from '../Constants/Constants';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,// Replace with your API base URL
  withCredentials: true, // Ensures cookies are sent with requests if needed
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle errors before the request is sent
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional)
apiClient.interceptors.response.use(
  (response) => {
    return response; // Simply return the response if successful
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if the auth token is missing from cookies
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      
      if (!tokenCookie) {
        console.warn('No authentication token found. Redirecting to login.');
      } else {
        console.error('Unauthorized access. Please log in again.');
      }

      // Remove authToken from storage
      localStorage.removeItem('accessToken'); 

      // Redirect to login page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


export default apiClient;
