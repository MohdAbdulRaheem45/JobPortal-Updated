import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Building2, Calendar, Wallet, Upload, XCircle, ArrowLeft } from "lucide-react";
import { getJobById, closeJob } from "../api/jobs";
import { applyToJob } from "../api/applications";
import { useAuth } from "../context/AuthContext";
import { GlassCard, Badge, Loader, Button, Textarea } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isJobSeeker, isRecruiter } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [closing, setClosing] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const data = await getJobById(id);
      setJob(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(e) {
    e.preventDefault();
    if (!resume) {
      toast.error("Attach your resume as a PDF");
      return;
    }
    if (!resume.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF resumes are accepted");
      return;
    }
    setApplying(true);
    try {
      await applyToJob(job.id, resume, coverLetter);
      toast.success("Application submitted");
      setApplied(true);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setApplying(false);
    }
  }

  async function handleClose() {
    setClosing(true);
    try {
      await closeJob(job.id);
      toast.success("Job closed");
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setClosing(false);
    }
  }

  if (loading) return <Loader label="Loading job" />;
  if (!job) return null;

  const isOwner = isRecruiter && job.postedByName === user?.username;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <GlassCard strong className="p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{job.title}</h1>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
              <Building2 size={15} /> {job.company} · posted by {job.postedByName}
            </div>
          </div>
          <Badge tone={job.status}>{job.status}</Badge>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin size={15} /> {job.location}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-lime">
            <Wallet size={15} /> {job.salaryRange}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={15} /> Deadline {new Date(job.deadline).toLocaleDateString()}
          </span>
          <Badge tone={job.jobType}>{job.jobType?.replace("_", " ")}</Badge>
        </div>

        <div className="mb-6 h-px bg-white/10" />

        <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Description
        </h2>
        <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-ink/90">
          {job.description}
        </p>

        {isOwner && job.status === "OPEN" && (
          <Button variant="danger" loading={closing} onClick={handleClose}>
            <XCircle size={16} /> Close this job
          </Button>
        )}

        {isJobSeeker && job.status === "OPEN" && !applied && (
          <form onSubmit={handleApply} className="mt-2 flex flex-col gap-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
              Apply now
            </h2>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl glass px-3.5 py-3 text-sm text-muted hover:bg-white/10">
              <Upload size={16} />
              {resume ? resume.name : "Upload resume (PDF only)"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
              />
            </label>
            <Textarea
              label="Cover letter (optional)"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell them why you're a fit…"
            />
            <Button type="submit" loading={applying} className="self-start">
              Submit application
            </Button>
          </form>
        )}

        {applied && (
          <div className="mt-2 rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-lime">
            Application submitted — track it from "My applications".
          </div>
        )}

        {job.status === "CLOSED" && !isOwner && (
          <div className="mt-2 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
            This role is closed and no longer accepting applications.
          </div>
        )}
      </GlassCard>
    </div>
  );
}
