import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Search,
  PlusCircle,
  LayoutDashboard,
  User,
  Bell,
  MessageSquare,
  FileScan,
  LogOut,
  ClipboardList,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyNotifications } from "../api/notifications";

function NavItem({ to, icon: Icon, label, onNavigate, badge }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-gradient-to-r from-violet/30 to-magenta/20 text-ink border border-violet/40"
            : "text-muted hover:text-ink hover:bg-white/5"
        }`
      }
    >
      <Icon size={18} strokeWidth={2} />
      <span className="flex-1">{label}</span>
      {!!badge && (
        <span className="rounded-full bg-magenta px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function AppLayout({ children }) {
  const { user, isRecruiter, isJobSeeker, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyNotifications()
      .then((list) => {
        if (!cancelled) setUnread(list.filter((n) => !n.read).length);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const closeMobile = () => setMobileOpen(false);

  const nav = (
    <>
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-cyan font-display text-sm font-bold text-white">
          O
        </div>
        <span className="font-display text-lg font-semibold">Orbit</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavItem to="/jobs" icon={Search} label="Browse jobs" onNavigate={closeMobile} />

        {isRecruiter && (
          <>
            <NavItem to="/post-job" icon={PlusCircle} label="Post a job" onNavigate={closeMobile} />
            <NavItem to="/my-jobs" icon={Briefcase} label="My postings" onNavigate={closeMobile} />
          </>
        )}
        {isJobSeeker && (
          <NavItem to="/my-applications" icon={ClipboardList} label="My applications" onNavigate={closeMobile} />
        )}

        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onNavigate={closeMobile} />
        <NavItem to="/notifications" icon={Bell} label="Notifications" onNavigate={closeMobile} badge={unread} />

        <div className="my-3 h-px bg-white/10" />
        <span className="px-3.5 pb-1 text-[11px] font-mono uppercase tracking-wider text-faint">AI Tools</span>
        <NavItem to="/ai/chat" icon={MessageSquare} label="Career chatbot" onNavigate={closeMobile} />
        <NavItem to="/ai/resume-analyzer" icon={FileScan} label="Resume analyzer" onNavigate={closeMobile} />

        <div className="my-3 h-px bg-white/10" />
        <NavItem to="/profile" icon={User} label="Profile" onNavigate={closeMobile} />
      </nav>

      <div className="glass mt-4 rounded-xl p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet font-display text-sm font-semibold text-white">
            {user?.username?.[0]?.toUpperCase() || <Users size={16} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user?.username}</p>
            <p className="truncate text-xs text-faint">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-muted hover:text-rose hover:bg-rose/10 transition-colors"
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen">
      <div className="aurora-field">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 flex-col p-4 md:flex">
          {nav}
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between glass px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-cyan font-display text-xs font-bold text-white">
              O
            </div>
            <span className="font-display font-semibold">Orbit</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="text-ink">
            <Menu size={22} />
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 flex md:hidden">
            <div className="glass-strong flex h-full w-72 flex-col p-4">
              <button onClick={closeMobile} className="mb-4 self-end text-muted">
                <X size={22} />
              </button>
              {nav}
            </div>
            <div className="flex-1 bg-black/40" onClick={closeMobile} />
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 pb-16 pt-20 md:px-8 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
