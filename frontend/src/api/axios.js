import axios from "axios";

const api = axios.create({
  // ✅ Use environment variable (works for local + Vercel)
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
