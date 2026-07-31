import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAllJobs, searchJobs } from "../api/jobs";
import { GlassCard, Badge, Loader, EmptyState, Input, Button } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

const PAGE_SIZE = 9;

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [activeSearch, setActiveSearch] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeSearch]);

  async function load() {
    setLoading(true);
    try {
      const data = activeSearch
        ? await searchJobs({ ...activeSearch, page, size: PAGE_SIZE })
        : await getAllJobs(page, PAGE_SIZE);
      setJobs(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    setActiveSearch(q || location ? { q, location } : null);
  }

  function clearSearch() {
    setQ("");
    setLocation("");
    setActiveSearch(null);
    setPage(0);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Browse open roles</h1>
        <p className="mt-1 text-sm text-muted">Search across every active listing on Orbit.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Job title or keyword"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="shrink-0">
            <Search size={16} /> Search
          </Button>
          {activeSearch && (
            <Button type="button" variant="secondary" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader label="Fetching jobs" />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs match yet"
          description="Try a different keyword or location, or check back soon — new roles land here as recruiters post them."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          <ChevronLeft size={16} /> Prev
        </Button>
        <span className="font-mono text-sm text-muted">Page {page + 1}</span>
        <Button
          variant="secondary"
          disabled={jobs.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

const typeAccent = {
  FULL_TIME: "from-violet/60",
  PART_TIME: "from-cyan/60",
  INTERNSHIP: "from-pink/60",
};

function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job.id}`}>
      <GlassCard className={`group relative overflow-hidden p-5 transition-transform hover:-translate-y-0.5 border-l-2`}>
        <div
          className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${
            typeAccent[job.jobType] || "from-violet/60"
          } to-transparent`}
        />
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-ink group-hover:text-cyan transition-colors line-clamp-2">
            {job.title}
          </h3>
          <Badge tone={job.status}>{job.status}</Badge>
        </div>
        <div className="mb-1 flex items-center gap-1.5 text-sm text-muted">
          <Building2 size={14} /> {job.company}
        </div>
        <div className="mb-3 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} /> {job.location}
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-faint">{job.description}</p>
        <div className="flex items-center justify-between">
          <Badge tone={job.jobType}>{job.jobType?.replace("_", " ")}</Badge>
          <span className="font-mono text-xs text-lime">{job.salaryRange}</span>
        </div>
      </GlassCard>
    </Link>
  );
}
