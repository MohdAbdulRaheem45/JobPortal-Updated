import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/guards";
import AppLayout from "./components/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import ApplicantsForJob from "./pages/ApplicantsForJob";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import AIChat from "./pages/AIChat";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import NotFound from "./pages/NotFound";

function Protected({ children, role }) {
  return (
    <ProtectedRoute>
      <AppLayout>{role ? <RoleRoute role={role}>{children}</RoleRoute> : children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#130a2e",
              color: "#F5F3FF",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: "13px",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/jobs" element={<Protected><Jobs /></Protected>} />
          <Route path="/jobs/:id" element={<Protected><JobDetail /></Protected>} />

          <Route path="/post-job" element={<Protected role="RECRUITER"><PostJob /></Protected>} />
          <Route path="/my-jobs" element={<Protected role="RECRUITER"><MyJobs /></Protected>} />
          <Route
            path="/my-jobs/:jobId/applicants"
            element={<Protected role="RECRUITER"><ApplicantsForJob /></Protected>}
          />

          <Route
            path="/my-applications"
            element={<Protected role="JOB_SEEKER"><MyApplications /></Protected>}
          />

          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />

          <Route path="/ai/chat" element={<Protected><AIChat /></Protected>} />
          <Route path="/ai/resume-analyzer" element={<Protected><ResumeAnalyzer /></Protected>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
