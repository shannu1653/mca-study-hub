import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // must end with /api/
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

    const isPublicRoute = publicRoutes.some(
      (route) => config.url && config.url.startsWith(route)
    );

    if (!isPublicRoute) {
      const token = localStorage.getItem("access_token"); // ✅ FIXED
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
    const status = error.response?.status;

    if (status === 401) {
      // Prevent infinite redirect
      if (window.location.pathname !== "/login") {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
