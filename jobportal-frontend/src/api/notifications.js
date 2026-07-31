import api from "./axios";

// GET /api/notifications/my
export function getMyNotifications() {
  return api.get("/api/notifications/my").then((r) => r.data);
}

// PUT /api/notifications/{id}/read
export function markNotificationRead(id) {
  return api.put(`/api/notifications/${id}/read`).then((r) => r.data);
}
