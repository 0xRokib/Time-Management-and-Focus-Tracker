import axios from "axios";

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: "https://your-api-url.com", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
