import React, { useState } from "react";
import { ResumeData, JobMatchResult } from "../types";
import { Sparkles, FileText, CheckCircle2, AlertCircle, RefreshCw, Send, ChevronRight, Zap, Target, Flame, Lightbulb } from "lucide-react";

interface JobMatchModuleProps {
  resume: ResumeData;
  onOptimizeClick?: () => void;
}

export default function JobMatchModule({ resume, onOptimizeClick }: JobMatchModuleProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMatchAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/resume/jobmatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await response.json();
      if (data.matchPercentage !== undefined) {
        setResult(data);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to reach matching servers. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8 animate-fade-in text-zinc-100">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 font-display">Target Job Description Matching & Alignment</h2>
        <p className="text-sm text-zinc-400">Analyze required keywords, skills, and strategic achievements to align your resume with specific roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COMPONENT: PASTE JD FIELD */}
        <div className="lg:col-span-5 bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-baseline">
            <h3 className="font-bold text-zinc-400 text-[14px] uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-4 h-4 text-amber-400" /> Target Job Description
            </h3>
            <span className="text-[10px] font-bold text-zinc-500 font-mono">Limit: 10k words</span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            placeholder="Paste the full job post details here (including skills, tech requirements, and company mission)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 text-xs text-zinc-200 leading-normal focus:outline-none focus:border-amber-500/50 placeholder-zinc-500"
          />

          <button
            onClick={handleMatchAnalyze}
            disabled={!jobDescription.trim() || loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs tracking-wider shadow-md shadow-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Aligning & Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" /> Analyze Alignment Score
              </>
            )}
          </button>
        </div>

        {/* RIGHT COMPONENT: SCORES, MATCHES, MAPS */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="bg-[#0e0e11] border border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6 animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-zinc-800 rounded w-1/3"></div>
                  <div className="h-4 bg-zinc-900 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-900 rounded"></div>
                <div className="h-4 bg-zinc-900 rounded w-5/6"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 bg-rose-950/20 border border-rose-900/30 rounded-2xl text-center space-y-2 text-rose-400">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs font-bold">Matching Error</p>
              <p className="text-xs text-zinc-300">{error}</p>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="min-h-[384px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800/80 rounded-3xl bg-zinc-950/40">
              <Target className="w-14 h-14 text-zinc-600 stroke-[1.5] mb-4 animate-pulse" />
              <h4 className="font-bold text-zinc-300 text-sm">Resume Match Scanner Ready</h4>
              <p className="text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
                Paste the job description on the left to review match metrics, extracted required technologies, and SEO guidelines.
              </p>
            </div>
          )}

          {result && (
            <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Score Header */}
              <div className="flex items-center gap-5 border-b border-zinc-800/60 pb-5">
                <div className="relative flex items-center justify-center">
                  {/* Glowing match circle */}
                  <div className="w-20 h-20 rounded-full bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-amber-400">
                    <span className="text-2xl font-extrabold font-display leading-none">{result.matchPercentage}%</span>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Match</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-zinc-100 text-lg">
                    {result.extractedRole} [{result.extractedSeniority}]
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 text-[10px] font-bold border border-zinc-800/60">
                      Strength: {result.matchingStrength}
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Skills Checklist Badge Heap */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-500" /> Technology & Skills Heatmap
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all ${
                        skill.present
                          ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                          : "bg-rose-950/20 text-rose-400 border-rose-900/30"
                      }`}
                    >
                      {skill.present ? "✓" : "×"} {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing keywords warnings */}
              {result.missingKeywords?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Missing SEO Keywords</h4>
                  <p className="text-xs text-zinc-400 leading-normal">
                    These critical terms were found in the job description but are absent or weak in your resume. Insert them organically to beat semantic parsers:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.missingKeywords.map((word, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-400 text-xs font-semibold">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action list */}
              {result.suggestedImprovements?.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Customized Alignment Guidelines
                  </h4>
                  <div className="space-y-2">
                    {result.suggestedImprovements.map((imp, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-zinc-300 leading-relaxed">
                        <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">•</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
