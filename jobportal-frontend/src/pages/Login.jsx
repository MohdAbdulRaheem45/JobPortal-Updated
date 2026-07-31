import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { GlassCard, Input, Button } from "../components/ui";
import { API_BASE_URL, extractErrorMessage } from "../api/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      const dest = location.state?.from?.pathname || "/jobs";
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="aurora-field">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
      </div>
      <GlassCard strong className="relative z-10 w-full max-w-sm p-7">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-cyan font-display text-lg font-bold text-white">
            O
          </div>
          <h1 className="font-display text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in to continue to Orbit</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          <Button type="submit" loading={loading} className="mt-1 w-full">
            Log in
          </Button>
        </form>

        <a
          href={`${API_BASE_URL}/oauth2/authorization/google`}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl glass py-2.5 text-sm font-medium text-ink hover:bg-white/10 transition-colors"
        >
          Continue with Google
        </a>

        <p className="mt-5 text-center text-sm text-muted">
          New to Orbit?{" "}
          <Link to="/register" className="text-cyan hover:underline">
            Create an account
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
