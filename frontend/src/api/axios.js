import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    const publicRoutes = [
      "/auth/login/",
      "/auth/register/",
      "/auth/forgot-password/",
      "/auth/reset-password/",
    ];

    const isPublic = publicRoutes.some((route) =>
      config.url?.includes(route)
    );

    if (!isPublic) {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
