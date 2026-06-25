import React, { useState } from "react";
import { ResumeData } from "./types";
import { MOCK_RESUMES } from "./data";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import LiveBuilder from "./components/LiveBuilder";
import AtsModule from "./components/AtsModule";
import JobMatchModule from "./components/JobMatchModule";
import CoverLetterModule from "./components/CoverLetterModule";
import LinkedInModule from "./components/LinkedinModule";
import InterviewModule from "./components/InterviewModule";
import AiAssistant from "./components/AiAssistant";
import ExportModal from "./components/ExportModal";

// Icons from lucide-react
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  LayoutGrid,
  Mail,
  Gauge,
  Target,
  UserCheck,
  Linkedin,
  Wand2,
  TrendingUp,
  History,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Zap,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem("careercraft_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [resumes, setResumes] = useState<ResumeData[]>(() => {
    // Check if we have user info to patch the default mock resumes immediately
    const savedUser = localStorage.getItem("careercraft_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return MOCK_RESUMES.map(resume => {
          if (resume.personalInfo.name === "John Doe" || !resume.personalInfo.name) {
            return {
              ...resume,
              personalInfo: {
                ...resume.personalInfo,
                name: parsed.name,
                email: parsed.email,
                linkedin: "https://www.linkedin.com/feed"
              }
            };
          }
          return resume;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_RESUMES;
  });

  const [activeResumeId, setActiveResumeId] = useState<string>("john-doe-primary");
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [isPro, setIsPro] = useState(false);

  // Active Resume Data Reference
  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0];

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem("careercraft_user", JSON.stringify(newUser));

    setResumes((prevResumes) =>
      prevResumes.map((resume) => {
        if (resume.personalInfo.name === "John Doe" || !resume.personalInfo.name || resume.personalInfo.name === "") {
          return {
            ...resume,
            personalInfo: {
              ...resume.personalInfo,
              name: name,
              email: email,
              linkedin: "https://www.linkedin.com/feed"
            },
          };
        }
        return resume;
      })
    );
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Global Actions
  const handleCreateNewResume = (templateId = "modern-minimalist") => {
    const newResume: ResumeData = {
      id: "resume-" + Date.now(),
      title: "Untitled Resume Draft",
      templateId,
      colorTheme: "#2563EB",
      lastEdited: "Just now",
      personalInfo: {
        name: user?.name || "",
        title: "",
        email: user?.email || "",
        phone: "",
        location: "",
        website: "",
        linkedin: "https://www.linkedin.com/feed",
        github: ""
      },
      summary: "",
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      awards: [],
      languages: [],
      interests: ""
    };

    setResumes([newResume, ...resumes]);
    setActiveResumeId(newResume.id);
    setActiveMenu("builder");
  };

  const handleDuplicateResume = (id: string) => {
    const toDuplicate = resumes.find((r) => r.id === id);
    if (!toDuplicate) return;

    const duplicated: ResumeData = {
      ...JSON.parse(JSON.stringify(toDuplicate)),
      id: "resume-dup-" + Date.now(),
      title: `${toDuplicate.title} (Copy)`,
      lastEdited: "Just now"
    };

    setResumes([duplicated, ...resumes]);
  };

  const handleDeleteResume = (id: string) => {
    if (resumes.length <= 1) {
      alert("You must keep at least one resume draft.");
      return;
    }
    const filtered = resumes.filter((r) => r.id !== id);
    setResumes(filtered);
    if (activeResumeId === id) {
      setActiveResumeId(filtered[0].id);
    }
  };

  const handleImportLinkedIn = () => {
    alert("Authenticating LinkedIn Profile... Initializing data secure sync.");
  };

  const handleUploadExisting = () => {
    alert("Parsing resume file via ATS OCR parser...");
  };

  // Nav mapping list helper
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "builder", label: "My Resumes / Builder", icon: FileText },
    { id: "cover-letter", label: "Cover Letters", icon: Mail },
    { id: "ats-analyzer", label: "ATS Analyzer", icon: Gauge },
    { id: "job-matcher", label: "Job Matcher", icon: Target },
    { id: "interview-prep", label: "Interview Preparation", icon: UserCheck },
    { id: "linkedin", label: "LinkedIn Optimizer", icon: Linkedin },
  ];

  const helperSidebarItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help Center", icon: HelpCircle },
  ];

  // Main screen routing
  const renderMainContent = () => {
    switch (activeMenu) {
      case "cover-letter":
        return <CoverLetterModule resume={activeResume} />;
      case "ats-analyzer":
        return <AtsModule resume={activeResume} />;
      case "job-matcher":
        return <JobMatchModule resume={activeResume} />;
      case "linkedin":
        return <LinkedInModule resume={activeResume} />;
      case "interview-prep":
        return <InterviewModule resume={activeResume} />;
      case "builder":
        return (
          <LiveBuilder
            data={activeResume}
            onChange={(updatedResume) => {
              setResumes(resumes.map((r) => (r.id === updatedResume.id ? updatedResume : r)));
            }}
            onBack={() => setActiveMenu("dashboard")}
            onTriggerAtsAnalysis={() => setActiveMenu("ats-analyzer")}
            onTriggerJobMatch={() => setActiveMenu("job-matcher")}
          />
        );
      case "settings":
        return (
          <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-xl font-extrabold text-zinc-100 font-display">System Settings & Configurations</h2>
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-6 space-y-4 shadow-sm text-xs">
              <p className="font-semibold text-zinc-300">Account Tier: <span className="text-amber-400 font-bold">{isPro ? "Enterprise Pro" : "Free Trial"}</span></p>
              <p className="text-zinc-400">Sync with Google Calendar for interviews is enabled automatically on OAuth request.</p>
              <button
                onClick={() => setIsPro(!isPro)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl font-bold border border-amber-400/20 cursor-pointer transition-all"
              >
                Toggle Pro Status
              </button>
            </div>
          </div>
        );
      case "help":
        return (
          <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-xl font-extrabold text-zinc-100 font-display">Help & Career Support Center</h2>
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-6 space-y-3 shadow-sm text-xs text-zinc-400">
              <p className="font-bold text-zinc-200">1. How do I download my resume as a PDF?</p>
              <p>Click the "Export" or "Export PDF" button in the Top Right Navigation Bar. This triggers the system print manager optimized for A4 document downloads.</p>
              <p className="font-bold text-zinc-200 pt-2">2. What is an ATS Score?</p>
              <p>The Applicant Tracking System Score estimates how effectively automated HR parsing spiders read your font structures, bullet hierarchies, skills tables, and contact files.</p>
            </div>
          </div>
        );
      case "dashboard":
      default:
        return (
          <Dashboard
            resumes={resumes}
            onCreateNew={handleCreateNewResume}
            onEdit={(id) => {
              setActiveResumeId(id);
              setActiveMenu("builder");
            }}
            onDuplicate={handleDuplicateResume}
            onDelete={handleDeleteResume}
            onImportLinkedIn={handleImportLinkedIn}
            onUploadExisting={handleUploadExisting}
            userName={user?.name}
          />
        );
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative antialiased select-none">
      {/* 1. TOP PREMIUM NAVIGATION BAR */}
      <nav className="bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-40 px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Left branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold shadow-lg shadow-amber-500/10 border border-amber-400/20">
            <Sparkles className="w-5.5 h-5.5 fill-current text-amber-100 animate-pulse" />
          </div>
          <div>
            <h1 className="text-[15px] font-extrabold font-display tracking-tight text-zinc-100 leading-none">
              CareerCraft AI
            </h1>
            <span className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest leading-none mt-0.5 block">
              Pro Resume SaaS
            </span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="relative w-72 hidden md:block">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search resumes, jobs, resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-zinc-700"
          />
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          {/* AI Toggle */}
          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold active:scale-95 ${
              isAiOpen
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-md shadow-amber-500/5"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI Coach</span>
          </button>

          {/* Export modal trigger (Disabled on Dashboard screen, active on inner screens) */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
          >
            Export Resume
          </button>

          {/* Upgrades */}
          <button
            onClick={() => setIsPro(!isPro)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isPro
                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-800/40"
                : "bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold shadow-md shadow-amber-500/10"
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isPro ? "Enterprise Pro" : "Upgrade to Pro"}</span>
          </button>

          {/* Separator */}
          <span className="w-px h-6 bg-zinc-800 hidden sm:block"></span>

          {/* Notification bell */}
          <button className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all relative">
            <Bell className="w-4.5 h-4.5" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          {/* Profile pill */}
          <div className="flex items-center gap-2 border border-zinc-800 pl-2 pr-1.5 py-1 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <span className="text-[11px] font-bold text-zinc-300 hidden sm:inline">{user.name}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-extrabold text-amber-400 text-xs shadow-sm">
              {getInitials(user.name)}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. CORE LAYOUT WITH SIDEBAR & MAIN BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COMPACT SIDEBAR */}
        <aside className="w-64 bg-[#09090b] border-r border-zinc-800 shrink-0 hidden md:flex flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest px-3">Career Suite</span>
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id);
                        // Auto open builder draft if user switches to builder from elsewhere
                        if (item.id === "builder" && resumes.length > 0) {
                          setActiveResumeId(resumes[0].id);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest px-3">Support</span>
            <div className="space-y-1">
              {helperSidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MIDDLE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto bg-[#050505]">
          {renderMainContent()}
        </main>

        {/* PERSISTENT FLOATING SIDEBAR FOR AI ASSISTANT (RIGHT SIDE) */}
        {isAiOpen && (
          <aside className="w-96 shrink-0 border-l border-zinc-800 bg-[#09090b]">
            <AiAssistant resume={activeResume} />
          </aside>
        )}
      </div>

      {/* 3. PREMIUM GLOBAL EXPORT MODAL */}
      <ExportModal
        resume={activeResume}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
