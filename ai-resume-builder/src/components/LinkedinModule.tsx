import React, { useState, useEffect } from "react";
import { ResumeData, LinkedInResult } from "../types";
import { Sparkles, Linkedin, CheckCircle2, RefreshCw, Copy, Check, MessageSquare, List, Key, Award, ShieldAlert } from "lucide-react";

interface LinkedInModuleProps {
  resume: ResumeData;
}

export default function LinkedInModule({ resume }: LinkedInModuleProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runLinkedinOptimizer = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resume/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await response.json();
      if (data.profileScore !== undefined) {
        setResult(data);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to connect to the LinkedIn Optimizer API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runLinkedinOptimizer();
  }, [resume.id]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse text-zinc-400">
        <div className="h-10 bg-zinc-800 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-zinc-800 rounded-2xl"></div>
          <div className="h-40 bg-zinc-800 rounded-2xl col-span-2"></div>
        </div>
        <div className="h-64 bg-zinc-800 rounded-3xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="font-bold text-zinc-100">LinkedIn Optimizer Offline</h3>
        <p className="text-xs text-zinc-400">{error}</p>
        <button onClick={runLinkedinOptimizer} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold rounded-xl transition-all active:scale-95">
          Retry Scan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8 animate-fade-in text-zinc-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 font-display">Social & LinkedIn Search Profile Optimizer</h2>
          <p className="text-sm text-zinc-400">Tune your social copy, write high-traffic headlines, and draft searchable summaries for recruiter discovery.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <a
            href="https://www.linkedin.com/feed"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Linkedin className="w-3.5 h-3.5 fill-current" /> Go to LinkedIn Feed
          </a>
          <button
            onClick={runLinkedinOptimizer}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Optimize Profile
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: PROFILE STATS, KEYWORDS, TIPS */}
          <div className="lg:col-span-4 space-y-6">
            {/* Score box */}
            <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl space-y-4 border border-zinc-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#f59e0b,transparent_45%)]"></div>
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Social Discoverability</span>
                <p className="text-4xl font-extrabold font-display leading-none text-zinc-100">{result.profileScore}/100</p>
                <p className="text-xs text-zinc-300">
                  {result.profileScore >= 85 ? "Excellent SEO visibility. Recruiter-ready!" : "Moderate visibility. Update headlines & key terms."}
                </p>
              </div>
            </div>

            {/* Keyword checklist */}
            <div className="p-5 bg-[#0e0e11] border border-zinc-800/80 rounded-2xl space-y-3.5">
              <h4 className="font-bold text-zinc-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <Key className="w-4 h-4 text-amber-400" /> High-Traffic SEO Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.seoKeywords?.map((word, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800/60 text-zinc-300 text-xs font-mono font-medium">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile setup tips */}
            <div className="p-5 bg-[#0e0e11] border border-zinc-800/80 rounded-2xl space-y-3.5">
              <h4 className="font-bold text-zinc-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-400" /> completeness checklist
              </h4>
              <div className="space-y-2.5">
                {result.profileCompletenessTips?.map((tip, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-xs text-zinc-300 leading-normal">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT VIEW: READY TO COPY GENERATIONS */}
          <div className="lg:col-span-8 space-y-8">
            {/* Headlines Section */}
            <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-400 text-[14px] flex items-center gap-1.5 uppercase tracking-wider">
                <Linkedin className="w-4.5 h-4.5 text-amber-500" /> Recruiter-optimized Profile Headlines
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Copy one of these high-impact headlines designed to prioritize search algorithms while conveying your core value proposition:
              </p>
              <div className="space-y-3 pt-2">
                {result.headlineSuggestions?.map((headline, idx) => {
                  const id = `headline-${idx}`;
                  return (
                    <div
                      key={idx}
                      className="group bg-zinc-900 border border-zinc-800/60 hover:border-amber-500/30 p-4 rounded-xl flex justify-between items-center gap-4 transition-colors"
                    >
                      <p className="text-xs font-bold text-zinc-200 leading-relaxed font-sans">{headline}</p>
                      <button
                        onClick={() => handleCopy(headline, id)}
                        className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-100 shadow-sm transition-all"
                      >
                        {copiedId === id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
                <h3 className="font-bold text-zinc-400 text-[14px] uppercase tracking-wider">
                  LinkedIn 'About' Section draft
                </h3>
                <button
                  onClick={() => handleCopy(result.aboutSection, "about")}
                  className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-zinc-850 hover:text-zinc-100 transition-all"
                >
                  {copiedId === "about" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Section
                </button>
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl whitespace-pre-wrap select-text">
                {result.aboutSection}
              </div>
            </div>

            {/* Work Bullet Improvements comparison */}
            {result.experienceImprovements?.length > 0 && (
              <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-zinc-400 text-[14px] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4.5 h-4.5 text-amber-500" /> Profile Bullet Point Transformations
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  LinkedIn experiences should be slightly more descriptive and impact-driven. Apply these transformations:
                </p>
                <div className="space-y-4 pt-1">
                  {result.experienceImprovements.map((exp, idx) => (
                    <div key={idx} className="border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Bullet {idx + 1}
                      </div>
                      <div className="p-4 space-y-2 text-xs leading-relaxed">
                        <p className="text-zinc-500 italic">
                          <span className="font-extrabold text-rose-400 font-mono">Before:</span> {exp.before}
                        </p>
                        <p className="text-zinc-200 font-semibold">
                          <span className="font-extrabold text-emerald-400 font-mono">After:</span> {exp.after}
                        </p>
                        <p className="text-[10px] font-bold text-amber-400 uppercase font-mono">
                          ⚡ Impact Reason: {exp.impact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
