import axios from "axios";

const api = axios.create({
  baseURL: "https://mca-study-hub.onrender.com/api/",
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
