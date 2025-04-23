import axios from "axios";

//  Axios instance with a base URL
const apiClient = axios.create({
  baseURL: "https://focus-tracker-backend-azure.vercel.app",
  // baseURL: "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

// hosted link
// https://ph-dev-task-ol67.onrender.com/
// http://localhost:5001

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
