import { useState } from "react";
import toast from "react-hot-toast";
import { FileScan, Upload, ThumbsUp, ThumbsDown, ListChecks, Lightbulb } from "lucide-react";
import { analyzeResume } from "../api/ai";
import { GlassCard, Button, Loader } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

// The backend returns one plain-text block structured as:
// Strengths: / Weaknesses: / Missing Skills: / Suggestions:
// This parses those sections into cards without assuming exact formatting.
function parseSections(raw) {
  const headings = ["Strengths", "Weaknesses", "Missing Skills", "Suggestions"];
  const sections = {};
  const pattern = new RegExp(`(${headings.join("|")})\\s*:`, "gi");
  const parts = raw.split(pattern);
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i].trim();
    const body = (parts[i + 1] || "").trim();
    sections[key] = body;
  }
  return Object.keys(sections).length > 0 ? sections : null;
}

const icons = {
  Strengths: ThumbsUp,
  Weaknesses: ThumbsDown,
  "Missing Skills": ListChecks,
  Suggestions: Lightbulb,
};
const tones = {
  Strengths: "text-lime",
  Weaknesses: "text-rose",
  "Missing Skills": "text-amber",
  Suggestions: "text-cyan",
};

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!file) {
      toast.error("Choose a PDF resume first");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are accepted");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeResume(file);
      setResult(analysis);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const sections = result ? parseSections(result) : null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display mb-1 flex items-center gap-2 text-2xl font-semibold">
        <FileScan size={22} className="text-cyan" /> Resume analyzer
      </h1>
      <p className="mb-6 text-sm text-muted">
        Upload a PDF resume and Gemini will break down strengths, gaps, and suggestions.
      </p>

      <GlassCard strong className="p-6 sm:p-8">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-6 py-10 text-center hover:bg-white/5 transition-colors">
          <Upload size={22} className="text-muted" />
          <span className="text-sm text-ink">{file ? file.name : "Click to choose a PDF resume"}</span>
          <span className="text-xs text-faint">PDF only</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <Button onClick={handleAnalyze} loading={loading} className="mt-5 w-full">
          Analyze resume
        </Button>
      </GlassCard>

      {loading && <Loader label="Reading your resume" />}

      {result && (
        <div className="mt-6 flex flex-col gap-3">
          {sections ? (
            Object.entries(sections).map(([title, body]) => {
              const Icon = icons[title] || Lightbulb;
              return (
                <GlassCard key={title} className="p-5">
                  <h3 className={`font-display mb-2 flex items-center gap-2 text-sm font-semibold ${tones[title]}`}>
                    <Icon size={16} /> {title}
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink/90">{body}</p>
                </GlassCard>
              );
            })
          ) : (
            <GlassCard className="p-5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink/90">{result}</p>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
