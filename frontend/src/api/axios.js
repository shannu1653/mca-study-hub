import axios from "axios";

const api = axios.create({
  baseURL: "https://mca-study-hub.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  ✅ Attach token ONLY for protected routes
  ❌ NEVER attach token for login/register/forgot/reset
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    const publicRoutes = [
      "auth/login/",
      "auth/register/",
      "auth/forgot-password/",
      "auth/reset-password/",
    ];

    const isPublic = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    if (!isPublic && token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
