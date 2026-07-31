import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./ui";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking your session" />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking your session" />;
  if (user?.role !== role) {
    return <Navigate to="/jobs" replace />;
  }
  return children;
}
