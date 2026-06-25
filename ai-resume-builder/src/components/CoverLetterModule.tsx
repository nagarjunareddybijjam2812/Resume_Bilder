import React, { useState } from "react";
import { ResumeData, CoverLetterData } from "../types";
import { Sparkles, FileText, Download, Copy, RefreshCw, Send, Check, Mail, Building, Briefcase } from "lucide-react";

interface CoverLetterModuleProps {
  resume: ResumeData;
}

export default function CoverLetterModule({ resume }: CoverLetterModuleProps) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [date, setDate] = useState("June 25, 2026");
  const [tone, setTone] = useState<"Professional" | "Friendly" | "Executive" | "Technical" | "Creative">("Professional");
  const [loading, setLoading] = useState(false);
  const [letterBody, setLetterBody] = useState("");
  const [copied, setCopied] = useState(false);

  const generateCoverLetter = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/resume/coverletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          recipientName,
          recipientTitle,
          companyName,
          companyAddress,
          date,
          tone,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setLetterBody(data.result);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to the cover letter generation API.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones = ["Professional", "Friendly", "Executive", "Technical", "Creative"];

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8 animate-fade-in text-zinc-100">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 font-display">Targeted Cover Letter Architect</h2>
        <p className="text-sm text-zinc-400">Draft tailor-made letters for specific companies leveraging the background story inside your resume.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COMPONENT: COMPANY INFO */}
        <div className="lg:col-span-5 bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-400 text-[13px] uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-amber-400" /> Target Company Details
          </h3>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Target Company Name</label>
              <input
                type="text"
                placeholder="e.g. Stripe, OpenAI, Linear"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Hiring Manager Name</label>
              <input
                type="text"
                placeholder="e.g. Jane Smith"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Recipient Job Title</label>
              <input
                type="text"
                placeholder="e.g. Director of Engineering"
                value={recipientTitle}
                onChange={(e) => setRecipientTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900"
              />
            </div>
          </div>

          {/* TONE CONTROLLER */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Strategic Letter Tone</label>
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    tone === t
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateCoverLetter}
            disabled={!companyName.trim() || loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs tracking-wider shadow-md shadow-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Drafting Premium Letter...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" /> Draft Cover Letter
              </>
            )}
          </button>
        </div>

        {/* RIGHT COMPONENT: PREVIEW */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="bg-[#0e0e11] border border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6 animate-pulse min-h-[500px]">
              <div className="space-y-3">
                <div className="h-5 bg-zinc-800 rounded w-1/4"></div>
                <div className="h-4 bg-zinc-900 rounded w-1/3"></div>
              </div>
              <div className="space-y-2 pt-6">
                <div className="h-4 bg-zinc-900 rounded"></div>
                <div className="h-4 bg-zinc-900 rounded"></div>
                <div className="h-4 bg-zinc-900 rounded w-5/6"></div>
              </div>
            </div>
          )}

          {!loading && !letterBody && (
            <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800/80 rounded-3xl bg-zinc-950/40">
              <Mail className="w-14 h-14 text-zinc-600 stroke-[1.5] mb-4" />
              <h4 className="font-bold text-zinc-300 text-sm">Cover Letter Drafting Deck</h4>
              <p className="text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
                Add target details on the left, select a strategic tone, and let Gemini draft a world-class professional narrative.
              </p>
            </div>
          )}

          {letterBody && !loading && (
            <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl shadow-lg relative overflow-hidden flex flex-col min-h-[500px]">
              {/* Envelope visual top strip */}
              <div className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 w-full"></div>

              {/* Toolbar */}
              <div className="bg-zinc-900/60 border-b border-zinc-850 px-6 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                  <span className="text-xs font-semibold text-zinc-500">Cover Letter Output</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Text
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* The elegant letter print layout */}
              <div className="p-8 space-y-6 text-xs text-zinc-300 leading-relaxed font-sans overflow-y-auto flex-1 select-text">
                {/* Header sender info */}
                <div className="space-y-0.5">
                  <p className="font-bold text-zinc-100">{resume.personalInfo?.name || "Your Name"}</p>
                  <p className="text-zinc-400">{resume.personalInfo?.title}</p>
                  <p className="text-zinc-500">{resume.personalInfo?.location} • {resume.personalInfo?.email}</p>
                </div>

                <div className="w-full h-px bg-zinc-800/60"></div>

                {/* Date and Recipient */}
                <div className="space-y-2">
                  <p className="text-zinc-400">{date}</p>
                  <div className="space-y-0.5">
                    <p className="font-bold text-zinc-100">{recipientName || "Hiring Team"}</p>
                    <p className="text-zinc-400">{recipientTitle || "Hiring Manager"}</p>
                    <p className="font-semibold text-zinc-300">{companyName}</p>
                    {companyAddress && <p className="text-zinc-500">{companyAddress}</p>}
                  </div>
                </div>

                {/* Letter Body */}
                <div className="space-y-4 whitespace-pre-wrap text-zinc-300 leading-relaxed">
                  {letterBody}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
