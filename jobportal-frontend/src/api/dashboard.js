import api from "./axios";

// GET /api/dashboard
export function getDashboard() {
  return api.get("/api/dashboard").then((r) => r.data);
}
