
import axios from 'axios';

const BASE_URL = "https://4962-102-210-40-6.ngrok-free.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for cross-origin requests
  timeout: 10000, // Add a timeout to prevent hanging requests
});

// Add interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
