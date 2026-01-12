import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

/* ✅ Attach DRF Token (SINGLE SOURCE OF TRUTH) */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
