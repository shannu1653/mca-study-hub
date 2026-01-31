// src/api/dashboardApi.js
import axios from "./axios";

export const getUserDashboardStats = async () => {
  try {
    const response = await axios.get("/dashboard/user/");
    return response.data;
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};
