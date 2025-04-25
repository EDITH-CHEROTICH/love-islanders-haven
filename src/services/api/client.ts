
import axios from 'axios';

const BASE_URL = "https://4962-102-210-40-6.ngrok-free.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Accept'] = 'application/json';
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.statusText);
    return response;
  },
  (error) => {
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
