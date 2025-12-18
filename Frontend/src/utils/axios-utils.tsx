import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", // go through Vite proxy to avoid cross-site cookies
  withCredentials: true, // important for httpOnly cookies
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  failedQueue = [];
};

// Response interceptor to auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh if user is known to be authenticated
    const isAuthed = typeof window !== 'undefined' && window.localStorage?.getItem('isAuthenticated') === 'true';

    const url: string = originalRequest?.url || '';
    const isRefreshCall = url.includes('/users/refresh-token');
    const isAuthEndpoints = url.includes('/users/login') || url.includes('/users/logout') || url.includes('/users/register');

    if (error.response?.status === 401 && !originalRequest._retry && isAuthed && !isRefreshCall && !isAuthEndpoints) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/users/refresh-token"); // auto-refresh
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;