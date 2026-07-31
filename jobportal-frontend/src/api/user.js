import api from "./axios";

// GET /api/users/me
export function getMyProfile() {
  return api.get("/api/users/me").then((r) => r.data);
}

// PUT /api/users/me
export function updateProfile(payload) {
  return api.put("/api/users/me", payload).then((r) => r.data);
}
