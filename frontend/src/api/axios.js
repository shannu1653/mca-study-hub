import axios from "axios";

const api = axios.create({
  baseURL: "https://mca-study-hub.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach Token correctly
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access"); // ✅ CORRECT KEY

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
