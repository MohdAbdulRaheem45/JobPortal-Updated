import api from "./axios";

// POST /api/applications/{jobId} — multipart/form-data (JOB_SEEKER only)
export function applyToJob(jobId, resumeFile, coverLetter) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  if (coverLetter) formData.append("coverLetter", coverLetter);
  return api
    .post(`/api/applications/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

// GET /api/applications/my (JOB_SEEKER)
export function getMyApplications() {
  return api.get("/api/applications/my").then((r) => r.data);
}

// GET /api/applications/job/{jobId} (RECRUITER, owner-only)
export function getApplicationsByJob(jobId) {
  return api.get(`/api/applications/job/${jobId}`).then((r) => r.data);
}

// DELETE /api/applications/{applicationId}
export function withdrawApplication(applicationId) {
  return api.delete(`/api/applications/${applicationId}`).then((r) => r.data);
}

// PUT /api/applications/{applicationId}/status?status=ACCEPTED|REJECTED|PENDING
export function updateApplicationStatus(applicationId, status) {
  return api
    .put(`/api/applications/${applicationId}/status`, null, {
      params: { status },
    })
    .then((r) => r.data);
}
