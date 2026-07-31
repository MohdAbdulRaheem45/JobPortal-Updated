import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Rocket } from "lucide-react";
import { createJob } from "../api/jobs";
import { GlassCard, Input, Textarea, Select, Button } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

const initial = {
  title: "",
  company: "",
  location: "",
  salaryRange: "",
  jobType: "FULL_TIME",
  description: "",
  deadline: "",
};

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // datetime-local gives "YYYY-MM-DDTHH:mm" which matches LocalDateTime's
      // expected ISO format once seconds are appended.
      const payload = { ...form, deadline: `${form.deadline}:00` };
      const job = await createJob(payload);
      toast.success("Job posted");
      navigate(`/jobs/${job.id}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display mb-1 text-2xl font-semibold">Post a new job</h1>
      <p className="mb-6 text-sm text-muted">It'll go live for job seekers immediately.</p>

      <GlassCard strong className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Job title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Backend Developer (Spring Boot)"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Company"
              required
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="Acme Corp"
            />
            <Input
              label="Location"
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Hyderabad, IN"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Salary range"
              required
              value={form.salaryRange}
              onChange={(e) => update("salaryRange", e.target.value)}
              placeholder="₹6L – ₹10L / year"
            />
            <Select
              label="Job type"
              value={form.jobType}
              onChange={(e) => update("jobType", e.target.value)}
            >
              <option value="FULL_TIME">Full time</option>
              <option value="PART_TIME">Part time</option>
              <option value="INTERNSHIP">Internship</option>
            </Select>
          </div>
          <Input
            label="Application deadline"
            type="datetime-local"
            required
            value={form.deadline}
            onChange={(e) => update("deadline", e.target.value)}
          />
          <Textarea
            label="Description"
            required
            rows={6}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Responsibilities, requirements, tech stack…"
          />
          <Button type="submit" loading={loading} className="self-start">
            <Rocket size={16} /> Publish job
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
