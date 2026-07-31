import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/ui";

// Backend's OAuth2SuccessHandler redirects here with ?token=<jwt>
// NOTE: it currently hardcodes http://localhost:3000/oauth-success — if
// you're running the frontend on Vite's default port 5173, update
// OAuth2SuccessHandler.java to redirect to http://localhost:5173/oauth-success
// (and add that origin in CorsConfig) or this page will never be reached.
export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const { loginWithToken, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      toast.error("No token received from Google sign-in");
      navigate("/login");
      return;
    }
    loginWithToken(token);
    refreshProfile()
      .then(() => {
        toast.success("Signed in with Google");
        navigate("/jobs");
      })
      .catch(() => {
        toast.error("Couldn't load your profile");
        navigate("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loader label="Finishing sign-in" />;
}
