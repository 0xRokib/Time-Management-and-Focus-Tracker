import axios from "axios";

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: "http://localhost:5001", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
