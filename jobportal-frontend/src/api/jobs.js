import api from "./axios";

// POST /api/jobs (RECRUITER only)
export function createJob(payload) {
  return api.post("/api/jobs", payload).then((r) => r.data);
}

// GET /api/jobs?page=&size=
export function getAllJobs(page = 0, size = 10) {
  return api.get("/api/jobs", { params: { page, size } }).then((r) => r.data);
}

// GET /api/jobs/search?q=&location=&page=&size=
export function searchJobs({ q, location, page = 0, size = 10 }) {
  return api
    .get("/api/jobs/search", { params: { q, location, page, size } })
    .then((r) => r.data);
}

// GET /api/jobs/{id}
export function getJobById(id) {
  return api.get(`/api/jobs/${id}`).then((r) => r.data);
}

// GET /api/jobs/my (RECRUITER)
export function getMyJobs() {
  return api.get("/api/jobs/my").then((r) => r.data);
}

// PUT /api/jobs/{id}/close (RECRUITER, owner-only, enforced server-side)
export function closeJob(id) {
  return api.put(`/api/jobs/${id}/close`).then((r) => r.data);
}
