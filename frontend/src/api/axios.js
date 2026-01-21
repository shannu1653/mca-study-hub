import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token ONLY for protected routes
api.interceptors.request.use(
  (config) => {
    const authFree = [
      "/auth/login/",
      "/auth/register/",
      "/auth/forgot-password/",
      "/auth/reset-password/",
    ];

    const isAuthFree = authFree.some((url) =>
      config.url?.endsWith(url)
    );

    if (!isAuthFree) {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
