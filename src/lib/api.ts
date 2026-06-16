import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = window.location.pathname === '/';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!isAuthPage) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';
      }
    }
    const message = error.response?.data?.error || 'Something went wrong';
    // Show toast for 401 if we are on the login page (e.g. wrong password)
    if (error.response?.status !== 401 || isAuthPage) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
