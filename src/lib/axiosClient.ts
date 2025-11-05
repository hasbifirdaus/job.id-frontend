import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/API",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
