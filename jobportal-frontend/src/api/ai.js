import api from "./axios";

// POST /api/ai/chat -> { response: "..." }
export function chatWithAI(prompt) {
  return api.post("/api/ai/chat", { prompt }).then((r) => r.data.response);
}

// POST /api/ai/analyze-resume — multipart/form-data -> plain text analysis
export function analyzeResume(resumeFile) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  return api
    .post("/api/ai/analyze-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}
