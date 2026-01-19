import axios from "axios";

const api = axios.create({
  baseURL: "https://mca-study-hub.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    // ✅ Only attach token if request is NOT login/register
    if (
      token &&
      !config.url.includes("login") &&
      !config.url.includes("register")
    ) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ FIX
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
