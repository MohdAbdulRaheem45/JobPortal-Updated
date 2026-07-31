import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, Trash2, Briefcase } from "lucide-react";
import { getMyApplications, withdrawApplication } from "../api/applications";
import { GlassCard, Badge, Loader, EmptyState, Button } from "../components/ui";
import { extractErrorMessage, API_BASE_URL } from "../api/axios";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setApps(await getMyApplications());
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(id) {
    if (!confirm("Withdraw this application? This can't be undone.")) return;
    setWithdrawingId(id);
    try {
      await withdrawApplication(id);
      toast.success("Application withdrawn");
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setWithdrawingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display mb-1 text-2xl font-semibold">My applications</h1>
      <p className="mb-6 text-sm text-muted">Track the status of every role you've applied to.</p>

      {loading ? (
        <Loader label="Loading applications" />
      ) : apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse open roles and apply to see them tracked here."
          action={
            <Link to="/jobs">
              <Button>
                <Briefcase size={16} /> Browse jobs
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map((app) => (
            <GlassCard key={app.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="font-display text-base font-semibold text-ink hover:text-cyan"
                    >
                      {app.jobTitle}
                    </Link>
                    <Badge tone={app.status}>{app.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-faint">
                    Applied {new Date(app.appliedAt).toLocaleString()}
                  </div>
                  {app.coverLetter && (
                    <p className="mt-2 max-w-lg text-sm text-ink/80">{app.coverLetter}</p>
                  )}
                  <a
                    href={`${API_BASE_URL}/${app.resumePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-cyan hover:underline"
                  >
                    <FileText size={14} /> Your resume
                  </a>
                </div>
                {app.status === "PENDING" && (
                  <Button
                    variant="danger"
                    loading={withdrawingId === app.id}
                    onClick={() => handleWithdraw(app.id)}
                  >
                    <Trash2 size={15} /> Withdraw
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
