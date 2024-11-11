import axios from "axios";


// Create axios instance with base URL

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Enable cookies
});

export default api