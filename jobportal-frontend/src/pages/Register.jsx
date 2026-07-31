import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Briefcase, UserSearch } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { GlassCard, Input, Button } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "JOB_SEEKER",
  });
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created — log in to continue");
      navigate("/login");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="aurora-field">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b3" />
      </div>
      <GlassCard strong className="relative z-10 w-full max-w-sm p-7">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-cyan font-display text-lg font-bold text-white">
            O
          </div>
          <h1 className="font-display text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Join Orbit as a job seeker or recruiter</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <RoleOption
              icon={UserSearch}
              label="Job seeker"
              active={form.role === "JOB_SEEKER"}
              onClick={() => update("role", "JOB_SEEKER")}
            />
            <RoleOption
              icon={Briefcase}
              label="Recruiter"
              active={form.role === "RECRUITER"}
              onClick={() => update("role", "RECRUITER")}
            />
          </div>

          <Input
            label="Username"
            required
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            placeholder="Raheem"
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Phone"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="9876543210"
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" loading={loading} className="mt-1 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan hover:underline">
            Log in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

function RoleOption({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors ${
        active
          ? "border-violet/50 bg-gradient-to-b from-violet/25 to-magenta/10 text-ink"
          : "border-white/10 text-muted hover:bg-white/5"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
