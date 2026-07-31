export function GlassCard({ children, className = "", strong = false, ...rest }) {
  return (
    <div
      className={`${strong ? "glass-strong" : "glass"} rounded-2xl ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

const variants = {
  primary:
    "bg-gradient-to-r from-violet to-magenta text-white shadow-lg shadow-violet-dim/30 hover:brightness-110",
  secondary: "glass text-ink hover:bg-white/10",
  ghost: "text-muted hover:text-ink hover:bg-white/5",
  danger: "bg-rose/90 text-white hover:brightness-110",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  loading,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </button>
  );
}

export function Input({ label, error, className = "", ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-xl glass px-3.5 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-cyan/50 transition-colors ${className}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-rose">{error}</span>}
    </label>
  );
}

export function Textarea({ label, error, className = "", ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
      )}
      <textarea
        className={`w-full rounded-xl glass px-3.5 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-cyan/50 transition-colors resize-none ${className}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-rose">{error}</span>}
    </label>
  );
}

export function Select({ label, error, className = "", children, ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
      )}
      <select
        className={`w-full rounded-xl glass px-3.5 py-2.5 text-sm text-ink outline-none focus:border-cyan/50 transition-colors [&>option]:bg-void-2 ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-rose">{error}</span>}
    </label>
  );
}

const badgeColors = {
  OPEN: "bg-lime/15 text-lime border-lime/30",
  CLOSED: "bg-rose/15 text-rose border-rose/30",
  PENDING: "bg-amber/15 text-amber border-amber/30",
  ACCEPTED: "bg-lime/15 text-lime border-lime/30",
  REJECTED: "bg-rose/15 text-rose border-rose/30",
  FULL_TIME: "bg-violet/20 text-violet border-violet/40",
  PART_TIME: "bg-cyan/15 text-cyan border-cyan/30",
  INTERNSHIP: "bg-pink/15 text-pink border-pink/30",
  RECRUITER: "bg-violet/20 text-violet border-violet/40",
  JOB_SEEKER: "bg-cyan/15 text-cyan border-cyan/30",
};

export function Badge({ children, tone }) {
  const cls = badgeColors[tone] || "bg-white/10 text-muted border-white/20";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wide ${cls}`}
    >
      {children}
    </span>
  );
}

export function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <div className="h-8 w-8 rounded-full border-2 border-white/15 border-t-cyan animate-spin" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
