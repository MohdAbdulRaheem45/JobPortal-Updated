import { Link, Navigate } from "react-router-dom";
import { Rocket, Sparkles, ShieldCheck, Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";

export default function Landing() {
  const { isAuthenticated, loading } = useAuth();
  if (!loading && isAuthenticated) return <Navigate to="/jobs" replace />;

  return (
    <div className="relative min-h-screen">
      <div className="aurora-field">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-cyan font-display text-sm font-bold text-white">
              O
            </div>
            <span className="font-display text-lg font-semibold">Orbit</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted hover:text-ink">
              Log in
            </Link>
            <Link to="/register">
              <Button className="!py-2">Get started</Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wide text-cyan">
            <Sparkles size={14} /> AI resume review, built in
          </div>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Find your next orbit —{" "}
            <span className="bg-gradient-to-r from-violet via-pink to-cyan bg-clip-text text-transparent">
              not just your next job
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">
            Recruiters post roles, job seekers apply in one click, and an AI
            copilot reviews your resume and answers career questions along the way.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button className="px-6 py-3 text-base">
                <Rocket size={18} /> Create free account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="px-6 py-3 text-base">
                I already have an account
              </Button>
            </Link>
          </div>
        </main>

        <section className="grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3">
          <FeatureCard
            icon={ShieldCheck}
            title="Role-based access"
            desc="Recruiters post & manage roles. Job seekers apply & track status — kept cleanly separate."
          />
          <FeatureCard
            icon={Bot}
            title="AI career chatbot"
            desc="Ask anything about your job search and get instant, contextual answers."
          />
          <FeatureCard
            icon={Sparkles}
            title="Resume analyzer"
            desc="Upload a PDF resume and get strengths, gaps, and suggestions in seconds."
          />
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="glass rounded-2xl p-5 text-left">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet/30 to-cyan/20 text-cyan">
        <Icon size={18} />
      </div>
      <h3 className="font-display mb-1 text-sm font-semibold text-ink">{title}</h3>
      <p className="text-sm text-muted">{desc}</p>
    </div>
  );
}
