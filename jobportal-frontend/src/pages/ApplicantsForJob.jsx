import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, FileText, CheckCircle2, XCircle, Mail } from "lucide-react";
import { getApplicationsByJob, updateApplicationStatus } from "../api/applications";
import { getJobById } from "../api/jobs";
import { GlassCard, Badge, Loader, EmptyState, Button } from "../components/ui";
import { extractErrorMessage, API_BASE_URL } from "../api/axios";

export default function ApplicantsForJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  async function load() {
    setLoading(true);
    try {
      const [jobData, appData] = await Promise.all([
        getJobById(jobId),
        getApplicationsByJob(jobId),
      ]);
      setJob(jobData);
      setApps(appData);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(id, status) {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      toast.success(`Marked as ${status.toLowerCase()}`);
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-display text-2xl font-semibold">
        Applicants {job && <span className="text-muted">· {job.title}</span>}
      </h1>
      <p className="mb-6 text-sm text-muted">Review resumes and update application status.</p>

      {loading ? (
        <Loader label="Loading applicants" />
      ) : apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Once job seekers apply, their applications will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map((app) => (
            <GlassCard key={app.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-semibold text-ink">
                      {app.applicantName}
                    </span>
                    <Badge tone={app.status}>{app.status}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <Mail size={14} /> {app.applicantEmail}
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
                    <FileText size={14} /> View resume
                  </a>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="secondary"
                    className="!bg-lime/15 !text-lime hover:!bg-lime/25"
                    loading={updatingId === app.id}
                    disabled={app.status === "ACCEPTED"}
                    onClick={() => handleStatus(app.id, "ACCEPTED")}
                  >
                    <CheckCircle2 size={15} /> Accept
                  </Button>
                  <Button
                    variant="danger"
                    loading={updatingId === app.id}
                    disabled={app.status === "REJECTED"}
                    onClick={() => handleStatus(app.id, "REJECTED")}
                  >
                    <XCircle size={15} /> Reject
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
