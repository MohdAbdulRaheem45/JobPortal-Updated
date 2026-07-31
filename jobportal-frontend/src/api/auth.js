import api from "./axios";

// POST /api/auth/register -> plain text success message
export function registerUser(payload) {
  return api.post("/api/auth/register", payload).then((r) => r.data);
}

// POST /api/auth/login -> raw JWT string (text/plain), NOT json
export function loginUser(payload) {
  return api.post("/api/auth/login", payload).then((r) => r.data);
}
