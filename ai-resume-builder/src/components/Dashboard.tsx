import React, { useState } from "react";
import { ResumeData } from "../types";
import { TEMPLATES, TemplateSpec } from "../data";
import { Plus, Upload, Linkedin, Eye, Copy, Trash2, Award, Zap, FileText, CheckCircle2, TrendingUp, Users, ArrowUpRight, Check, Star } from "lucide-react";
import AtsGauge from "./AtsGauge";

interface DashboardProps {
  resumes: ResumeData[];
  onCreateNew: (templateId?: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onImportLinkedIn: () => void;
  onUploadExisting: () => void;
  userName?: string;
}

export default function Dashboard({
  resumes,
  onCreateNew,
  onEdit,
  onDuplicate,
  onDelete,
  onImportLinkedIn,
  onUploadExisting,
  userName,
}: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterColor, setSelectedFilterColor] = useState("");

  const categories = [
    "All",
    "Minimal",
    "Executive",
    "Software Engineer",
    "Creative",
  ];

  // Filtering templates
  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === "All" || tpl.category === selectedCategory || (selectedCategory === "Software Engineer" && tpl.id === "startup-tech");
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-8 animate-fade-in text-zinc-100">
      {/* 1. HERO GREETING SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-[#09090b] text-white p-8 md:p-12 shadow-2xl border border-zinc-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_120%,rgba(212,175,55,0.08),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Zap className="w-48 h-48 text-amber-500 blur-2xl animate-pulse" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" /> AI-Powered Career Platform v3.5
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display leading-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-200">
              Welcome back, {userName || "John"} 👋
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl font-medium">
              Ready to optimize your experience and land your next dream job at Stripe or OpenAI?
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="btn-create-new-hero"
              onClick={() => onCreateNew("modern-minimalist")}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5 stroke-[3px]" /> Create New Resume
            </button>
            <button
              onClick={onUploadExisting}
              className="px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4.5 h-4.5 text-zinc-400" /> Upload PDF / Resume
            </button>
            <a
              href="https://www.linkedin.com/feed"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 border border-amber-900/30 font-semibold text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Linkedin className="w-4.5 h-4.5 fill-current" /> Import LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* 2. RECENT RESUMES CAROUSEL */}
      {resumes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 font-display">Recent Resumes</h2>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{resumes.length} Active Drafts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => {
              const score = 88; // Simulated high score
              return (
                <div
                  key={resume.id}
                  className="group relative bg-[#0e0e11] rounded-2xl border border-zinc-800/80 p-6 hover:shadow-xl transition-all hover:border-amber-500/30 glow-primary"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1 max-w-[70%]">
                      <h3 className="font-extrabold text-zinc-100 truncate text-[15px] group-hover:text-amber-400 transition-colors">
                        {resume.title}
                      </h3>
                      <p className="text-xs text-zinc-500 font-medium font-mono">
                        Template: <span className="text-zinc-300 font-semibold">{resume.templateId.replace("-", " ")}</span>
                      </p>
                    </div>
                    {/* Tiny ATS Gauge in upper corner */}
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-950/30 border border-emerald-800/30 font-bold text-emerald-400 font-display text-sm shadow-sm">
                      {score}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Completion</span>
                      <span className="font-bold text-zinc-200">95%</span>
                    </div>
                    {/* Premium Progress Bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-1.5 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 gap-2">
                    <button
                      onClick={() => onEdit(resume.id)}
                      className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 font-bold text-xs transition-colors active:scale-95"
                    >
                      Open Builder
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDuplicate(resume.id)}
                        title="Duplicate Resume"
                        className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 active:scale-95 transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(resume.id)}
                        title="Delete Resume"
                        className="p-2 rounded-lg hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 active:scale-95 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CORE ANALYTICS INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Cards Row */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0e0e11] rounded-2xl border border-zinc-800/80 p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Average ATS Score</span>
              <p className="text-2xl font-extrabold text-zinc-100">88.5 <span className="text-xs text-emerald-400 font-bold font-mono">Top 5%</span></p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0e0e11] rounded-2xl border border-zinc-800/80 p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Interview Rate</span>
              <p className="text-2xl font-extrabold text-zinc-100">24.2% <span className="text-xs text-amber-400 font-bold font-mono">+4.2%</span></p>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/30 text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0e0e11] rounded-2xl border border-zinc-800/80 p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recruiter Views</span>
              <p className="text-2xl font-extrabold text-zinc-100">412 <span className="text-xs text-emerald-400 font-bold font-mono">+18%</span></p>
            </div>
            <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-900/30 text-violet-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Visualiser Graph */}
        <div className="lg:col-span-2 bg-[#0e0e11] rounded-3xl border border-zinc-800/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-zinc-100 font-display text-[15px]">Recruiter Traffic & Application Success</h3>
              <p className="text-xs text-zinc-500">Showing organic profile discovery and success performance over last 30 days.</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-zinc-900 text-[10px] border border-zinc-800 font-bold text-zinc-400 uppercase tracking-wider">Live telemetry</div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="relative h-44 w-full flex items-end">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1f1f23" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1f1f23" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1f1f23" strokeWidth="1" />

              {/* Area */}
              <path
                d="M 0 150 L 0 120 Q 50 100 100 80 T 200 90 T 300 40 T 400 30 T 500 20 L 500 150 Z"
                fill="url(#chart-grad)"
              />
              {/* Line */}
              <path
                d="M 0 120 Q 50 100 100 80 T 200 90 T 300 40 T 400 30 T 500 20"
                fill="none"
                stroke="#d4af37"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            {/* Legend */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[10px] font-mono text-zinc-500 mt-2">
              <span>June 1</span>
              <span>June 10</span>
              <span>June 20</span>
              <span>June 25</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TEMPLATE GALLERY */}
      <div id="section-template-gallery" className="space-y-6 pt-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 font-display">Choose Your Resume Template</h2>
          <p className="text-sm text-zinc-400">Pick an industry-approved blueprint tailored by top tech recruiters and designers.</p>
        </div>

        {/* Filters and Search Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-zinc-800/80 pb-5">
          {/* Categories pills */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-3 py-2 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Pinterest-like grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="group bg-[#0e0e11] rounded-2xl border border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Simulated visual template thumbnail */}
              <div className="h-56 bg-gradient-to-br from-zinc-900/50 to-zinc-950 border-b border-zinc-800/60 relative p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  {tpl.premium && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                      Pro
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {tpl.atsRating}% ATS
                  </span>
                </div>

                {/* Simplified template schema representation */}
                <div className="w-full h-full bg-zinc-950 rounded-lg border border-zinc-800 p-4 shadow-sm group-hover:scale-102 transition-transform duration-300 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="w-24 h-2.5 bg-zinc-800 rounded-full"></div>
                    <div className="w-16 h-1.5 bg-zinc-900 rounded-full"></div>
                    <div className="w-full h-px bg-zinc-800/60 my-2"></div>
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-zinc-900 rounded-full"></div>
                      <div className="w-5/6 h-1 bg-zinc-900 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="w-16 h-2 bg-zinc-900 rounded-full"></div>
                    <div className="flex gap-1">
                      {tpl.colorOptions.map((c, i) => (
                        <span key={i} className="w-3 h-3 rounded-full border border-zinc-950" style={{ backgroundColor: c }}></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content and triggers */}
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-extrabold text-zinc-100 text-lg group-hover:text-amber-400 transition-colors">
                      {tpl.name}
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono font-medium">Popularity: {tpl.popularity}%</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onCreateNew(tpl.id)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/10 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
