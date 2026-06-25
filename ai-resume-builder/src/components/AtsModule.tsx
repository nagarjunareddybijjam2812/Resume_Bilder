import React, { useState, useEffect } from "react";
import { ResumeData, AtsAnalysisResult } from "../types";
import { Sparkles, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, ArrowUpRight, HelpCircle, Activity, Layout, Search, BookOpen, AlertTriangle } from "lucide-react";
import AtsGauge from "./AtsGauge";

interface AtsModuleProps {
  resume: ResumeData;
  onApplyFix?: (section: string, fixText: string) => void;
}

export default function AtsModule({ resume, onApplyFix }: AtsModuleProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resume/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await response.json();
      if (data.overallScore !== undefined) {
        setResult(data);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to connect to the ATS analysis server. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Run on load
  useEffect(() => {
    runAnalysis();
  }, [resume.id]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse text-zinc-400">
        <div className="h-10 bg-zinc-800 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-zinc-800 rounded-2xl col-span-1"></div>
          <div className="h-44 bg-zinc-800 rounded-2xl col-span-2"></div>
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-zinc-800 rounded w-1/4"></div>
          <div className="h-4 bg-zinc-900 rounded"></div>
          <div className="h-4 bg-zinc-900 rounded w-5/6"></div>
          <div className="h-4 bg-zinc-900 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-rose-950/30 border border-rose-900/30 text-rose-400">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100">ATS Connection Issue</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">{error}</p>
        <button
          onClick={runAnalysis}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8 animate-fade-in text-zinc-100">
      {/* MODULE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 font-display">Real-Time ATS Optimization Engine</h2>
          <p className="text-sm text-zinc-400">Scan and diagnose layout and keyword gaps based on Fortune 500 hiring scanners.</p>
        </div>
        <button
          onClick={runAnalysis}
          className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95"
        >
          Re-Scan Resume
        </button>
      </div>

      {result && (
        <div className="space-y-8">
          {/* 1. TOP STATS & GAUGE HERO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0e0e11] rounded-3xl border border-zinc-800/80 p-6 flex flex-col items-center justify-center shadow-sm">
              <AtsGauge score={result.overallScore} size={150} strokeWidth={12} />
            </div>

            <div className="bg-[#0e0e11] rounded-3xl border border-zinc-800/80 p-6 shadow-sm md:col-span-2 space-y-4">
              <h3 className="font-bold text-zinc-400 text-[14px] flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-amber-500" /> Scanner Diagnostic Breakdown
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1 p-3 bg-zinc-900 border border-zinc-800/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Layout className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold uppercase tracking-wider">Formatting</span>
                  </div>
                  <p className="text-lg font-extrabold text-zinc-100">{result.formatting?.score}/100</p>
                  <span className="text-[10px] font-semibold text-zinc-400">{result.formatting?.rating}</span>
                </div>

                <div className="space-y-1 p-3 bg-zinc-900 border border-zinc-800/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Search className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold uppercase tracking-wider">Keywords</span>
                  </div>
                  <p className="text-lg font-extrabold text-zinc-100">{result.keywords?.score}/100</p>
                  <span className="text-[10px] font-semibold text-zinc-400">{result.keywords?.rating}</span>
                </div>

                <div className="space-y-1 p-3 bg-zinc-900 border border-zinc-800/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <BookOpen className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold uppercase tracking-wider">Readability</span>
                  </div>
                  <p className="text-lg font-extrabold text-zinc-100">{result.readability?.score}/100</p>
                  <span className="text-[10px] font-semibold text-zinc-400">{result.readability?.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CRITICAL ISSUES & ALERTS */}
          {result.criticalIssues?.length > 0 && (
            <div className="p-5 bg-rose-950/20 border border-rose-900/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h4 className="font-extrabold text-[14px]">Critical Compliance Violations ({result.criticalIssues.length})</h4>
              </div>
              <ul className="space-y-2.5">
                {result.criticalIssues.map((issue, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-rose-400 font-medium leading-relaxed">
                    <span className="text-rose-500 font-extrabold shrink-0">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. STRENGTHS & WEAKNESSES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-3.5">
              <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4.5 h-4.5" /> Core Strengths
              </h4>
              <ul className="space-y-2">
                {result.strengths?.map((str, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 leading-normal flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-3.5">
              <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-1.5 text-amber-500">
                <AlertCircle className="w-4.5 h-4.5" /> Keyword & Content Gaps
              </h4>
              <ul className="space-y-2">
                {result.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 leading-normal flex items-start gap-2">
                    <span className="text-amber-500 shrink-0 mt-0.5 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. STRATEGIC IMPROVEMENT CHECKLISTS */}
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-100 text-lg font-display">Targeted Improvement Checklist</h3>
            <div className="grid grid-cols-1 gap-4">
              {result.suggestions?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e0e11] rounded-2xl border border-zinc-800 p-5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-amber-500/30 transition-colors"
                >
                  <div className="space-y-1.5 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase tracking-wider font-mono">
                        {item.section}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-200 leading-relaxed">
                      {item.issue}
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <span className="font-bold text-zinc-300">Recommendation:</span> {item.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
