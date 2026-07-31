import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, XCircle, PlusCircle, MapPin } from "lucide-react";
import { getMyJobs, closeJob } from "../api/jobs";
import { GlassCard, Badge, Loader, EmptyState, Button } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setJobs(await getMyJobs());
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleClose(id) {
    setClosingId(id);
    try {
      await closeJob(id);
      toast.success("Job closed");
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "CLOSED" } : j)));
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setClosingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">My postings</h1>
          <p className="mt-1 text-sm text-muted">Manage your listings and review applicants.</p>
        </div>
        <Link to="/post-job">
          <Button>
            <PlusCircle size={16} /> Post a job
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading your postings" />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="You haven't posted any jobs yet"
          description="Create your first listing to start receiving applications."
          action={
            <Link to="/post-job">
              <Button>
                <PlusCircle size={16} /> Post a job
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <GlassCard key={job.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="font-display text-base font-semibold text-ink hover:text-cyan"
                    >
                      {job.title}
                    </Link>
                    <Badge tone={job.status}>{job.status}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin size={14} /> {job.location} · {job.company}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to={`/my-jobs/${job.id}/applicants`}>
                    <Button variant="secondary">
                      <Users size={15} /> Applicants
                    </Button>
                  </Link>
                  {job.status === "OPEN" && (
                    <Button
                      variant="danger"
                      loading={closingId === job.id}
                      onClick={() => handleClose(job.id)}
                    >
                      <XCircle size={15} /> Close
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
