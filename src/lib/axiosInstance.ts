import { auth } from '@/contexts/AuthContext';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Ensure you have this environment variable set
});

// Function to get a fresh token
const getAuthToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken(true); // Ensures fresh token
  }
  return null;
};

// Add a request interceptor to include the Bearer token
axiosInstance.interceptors.request.use(
  async (config) => {  // Make this function async
    try {
      let token = await getAuthToken();
      if (!token) {
        token = localStorage.getItem('authToken'); // Fallback to stored token
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`;
      }
    } catch (error) {
      console.error("Error fetching auth token:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
