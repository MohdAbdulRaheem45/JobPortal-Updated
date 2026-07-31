import axios from "axios";

// Backend runs on 8080 by default (Spring Boot). Change via .env if needed.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The backend's GlobalExceptionHandler returns plain-text error bodies
// (not JSON), and validation failures fall through to a raw exception
// message. This normalizes all of that into a readable string.
export function extractErrorMessage(error) {
  if (!error.response) {
    return "Can't reach the server. Is the backend running on " + API_BASE_URL + "?";
  }
  const data = error.response.data;
  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }
  if (data?.message) return data.message;
  return `Something went wrong (${error.response.status})`;
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
