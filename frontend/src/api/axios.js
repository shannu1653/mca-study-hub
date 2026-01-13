import axios from "axios";

const api = axios.create({
  baseURL: "https://mca-study-hub.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ VERY IMPORTANT
});

// ✅ Attach Token ONLY if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
