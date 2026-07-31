import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Briefcase, CheckCircle2, Clock, XCircle, FolderOpen } from "lucide-react";
import { getDashboard } from "../api/dashboard";
import { GlassCard, Loader } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

const COLORS = {
  pending: "#fbbf24",
  accepted: "#a3e635",
  rejected: "#fb7185",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Crunching numbers" />;
  if (!data) return null;

  const pieData = [
    { name: "Pending", value: data.pendingApplications, color: COLORS.pending },
    { name: "Accepted", value: data.acceptedApplications, color: COLORS.accepted },
    { name: "Rejected", value: data.rejectedApplications, color: COLORS.rejected },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <h1 className="font-display mb-1 text-2xl font-semibold">Dashboard</h1>
      <p className="mb-6 text-sm text-muted">A live snapshot of activity across Orbit.</p>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Total jobs" value={data.totalJobs} accent="from-violet/40" />
        <StatCard icon={FolderOpen} label="Open jobs" value={data.openJobs} accent="from-lime/40" />
        <StatCard icon={XCircle} label="Closed jobs" value={data.closedJobs} accent="from-rose/40" />
        <StatCard icon={Clock} label="Total applications" value={data.totalApplications} accent="from-cyan/40" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <GlassCard strong className="p-6 lg:col-span-2">
          <h2 className="font-display mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Application outcomes
          </h2>
          {pieData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No applications yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#130a2e",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 12,
                      fontSize: 13,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#B4AFD1" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard strong className="p-6 lg:col-span-3">
          <h2 className="font-display mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Breakdown
          </h2>
          <div className="flex flex-col gap-3">
            <BreakdownRow icon={Clock} label="Pending" value={data.pendingApplications} color="text-amber" />
            <BreakdownRow icon={CheckCircle2} label="Accepted" value={data.acceptedApplications} color="text-lime" />
            <BreakdownRow icon={XCircle} label="Rejected" value={data.rejectedApplications} color="text-rose" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <GlassCard className="relative overflow-hidden p-4">
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${accent} to-transparent blur-xl`} />
      <Icon size={18} className="mb-2 text-muted" />
      <div className="font-display text-2xl font-semibold text-ink">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </GlassCard>
  );
}

function BreakdownRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between rounded-xl glass px-4 py-3">
      <span className={`flex items-center gap-2 text-sm ${color}`}>
        <Icon size={16} /> {label}
      </span>
      <span className="font-mono text-sm text-ink">{value}</span>
    </div>
  );
}
