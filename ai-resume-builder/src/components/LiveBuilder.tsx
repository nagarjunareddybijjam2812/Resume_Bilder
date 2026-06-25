import React, { useState } from "react";
import { ResumeData, WorkExperience, Education, Project, SkillCategory, Certification, Award, Language } from "../types";
import { TEMPLATES } from "../data";
import { ChevronDown, ChevronUp, Plus, Trash2, Wand2, Sparkles, ZoomIn, ZoomOut, Monitor, Tablet, Phone, Palette, ArrowLeft, Check, RefreshCw } from "lucide-react";
import ResumeTemplateRenderer from "./ResumeTemplateRenderer";

interface LiveBuilderProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  onBack: () => void;
  onTriggerAtsAnalysis: () => void;
  onTriggerJobMatch: () => void;
}

export default function LiveBuilder({
  data,
  onChange,
  onBack,
  onTriggerAtsAnalysis,
  onTriggerJobMatch,
}: LiveBuilderProps) {
  const [activeAccordion, setActiveAccordion] = useState<string>("personal");
  const [zoom, setZoom] = useState<number>(0.95);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isImproving, setIsImproving] = useState<string | null>(null);

  const toggleAccordion = (sec: string) => {
    setActiveAccordion(activeAccordion === sec ? "" : sec);
  };

  // Helper to deep copy and trigger updates
  const updateField = (section: keyof ResumeData, value: any) => {
    const updated = { ...data, [section]: value, lastEdited: "Just now" };
    onChange(updated);
  };

  const updatePersonalInfo = (field: string, val: string) => {
    const updatedPersonal = { ...data.personalInfo, [field]: val };
    updateField("personalInfo", updatedPersonal);
  };

  // AI Improve handler using server-side endpoint
  const handleAiImprove = async (
    text: string,
    type: "improve" | "expand" | "condense" | "action_verbs" | "quantify",
    sectionId: string,
    onSuccess: (improvedText: string) => void
  ) => {
    setIsImproving(sectionId);
    try {
      const response = await fetch("/api/resume/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          type,
          context: data.personalInfo.title,
        }),
      });
      const resData = await response.json();
      if (resData.result) {
        onSuccess(resData.result);
      } else if (resData.error) {
        alert(resData.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to AI server. Please check that process.env.GEMINI_API_KEY is defined.");
    } finally {
      setIsImproving(null);
    }
  };

  // List utilities (Experience)
  const addExperience = () => {
    const newItem: WorkExperience = {
      id: "exp-" + Date.now(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "• Spearheaded the deployment of...\n• Designed high-performance system configurations with [X]% accuracy...",
    };
    updateField("experience", [...data.experience, newItem]);
  };

  const updateExperience = (id: string, field: keyof WorkExperience, val: any) => {
    const list = data.experience.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateField("experience", list);
  };

  const deleteExperience = (id: string) => {
    updateField("experience", data.experience.filter((x) => x.id !== id));
  };

  // Education list utilities
  const addEducation = () => {
    const newItem: Education = {
      id: "edu-" + Date.now(),
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    };
    updateField("education", [...data.education, newItem]);
  };

  const updateEducation = (id: string, field: keyof Education, val: any) => {
    const list = data.education.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateField("education", list);
  };

  const deleteEducation = (id: string) => {
    updateField("education", data.education.filter((x) => x.id !== id));
  };

  // Projects list utilities
  const addProject = () => {
    const newItem: Project = {
      id: "proj-" + Date.now(),
      name: "",
      role: "",
      link: "",
      description: "• Architected open source plugin designed to...\n• Reduced computational latency by [X]ms on average...",
    };
    updateField("projects", [...data.projects, newItem]);
  };

  const updateProject = (id: string, field: keyof Project, val: any) => {
    const list = data.projects.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateField("projects", list);
  };

  const deleteProject = (id: string) => {
    updateField("projects", data.projects.filter((x) => x.id !== id));
  };

  // Skills list utilities
  const addSkillCategory = () => {
    const newItem: SkillCategory = {
      id: "sk-" + Date.now(),
      category: "Tools & Frameworks",
      skills: "React, Next.js, Node.js",
    };
    updateField("skills", [...data.skills, newItem]);
  };

  const updateSkillCategory = (id: string, field: keyof SkillCategory, val: string) => {
    const list = data.skills.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateField("skills", list);
  };

  const deleteSkillCategory = (id: string) => {
    updateField("skills", data.skills.filter((x) => x.id !== id));
  };

  // Certifications utilities
  const addCertification = () => {
    const newItem: Certification = {
      id: "cert-" + Date.now(),
      name: "",
      issuer: "",
      date: "",
    };
    updateField("certifications", [...data.certifications, newItem]);
  };

  const updateCertification = (id: string, field: keyof Certification, val: string) => {
    const list = data.certifications.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateField("certifications", list);
  };

  const deleteCertification = (id: string) => {
    updateField("certifications", data.certifications.filter((x) => x.id !== id));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* BUILDER HEADER CONTROL BAR */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 px-6 py-3 flex flex-wrap gap-4 items-center justify-between z-10 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-md font-bold text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-amber-500/50 focus:outline-none py-0.5 px-1 rounded"
            />
            <p className="text-[10px] text-zinc-500 font-medium px-1 uppercase font-mono">Last updated: {data.lastEdited}</p>
          </div>
        </div>

        {/* Rapid template switcher inside live builder */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-400" /> Template:
          </span>
          <select
            value={data.templateId}
            onChange={(e) => updateField("templateId", e.target.value)}
            className="text-xs font-bold text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500/40"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Color theme chooser */}
          <div className="flex items-center gap-1 px-2 border-l border-zinc-800">
            {TEMPLATES.find((t) => t.id === data.templateId)?.colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => updateField("colorTheme", color)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  data.colorTheme === color ? "border-zinc-100 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              >
                {data.colorTheme === color && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Action modules shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerAtsAnalysis}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> ATS Score
          </button>
          <button
            onClick={onTriggerJobMatch}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" /> Optimize JD
          </button>
        </div>
      </div>

      {/* DOUBLE-PANEL BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: SCROLLABLE ACCORDION FORM */}
        <div className="w-full md:w-1/2 bg-[#0e0e11] border-r border-zinc-800/80 overflow-y-auto p-6 space-y-4">
          {/* Section: Personal Details */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleAccordion("personal")}
              className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
            >
              <span className="font-bold text-zinc-100 text-[14px]">Personal Details</span>
              {activeAccordion === "personal" ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {activeAccordion === "personal" && (
              <div className="p-5 border-t border-zinc-800/60 bg-zinc-950/20 grid grid-cols-2 gap-4 animate-slide-down">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Target Title</label>
                  <input
                    type="text"
                    value={data.personalInfo.title}
                    onChange={(e) => updatePersonalInfo("title", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Email</label>
                  <input
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Phone</label>
                  <input
                    type="text"
                    value={data.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Location</label>
                  <input
                    type="text"
                    value={data.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Website</label>
                  <input
                    type="text"
                    value={data.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">LinkedIn Profile Link</label>
                  <input
                    type="text"
                    value={data.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Professional Summary */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleAccordion("summary")}
              className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
            >
              <span className="font-bold text-zinc-100 text-[14px]">Professional Summary</span>
              {activeAccordion === "summary" ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {activeAccordion === "summary" && (
              <div className="p-5 border-t border-zinc-800/60 bg-zinc-950/20 space-y-3 animate-slide-down">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Bio / Summary</label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() =>
                        handleAiImprove(data.summary, "improve", "summary", (txt) => updateField("summary", txt))
                      }
                      disabled={isImproving === "summary"}
                      className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {isImproving === "summary" ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} Magic Improve
                    </button>
                  </div>
                </div>
                <textarea
                  value={data.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 leading-normal focus:outline-none focus:border-amber-500/50"
                  placeholder="Summarize your professional accomplishments..."
                />
              </div>
            )}
          </div>

          {/* Section: Experience */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleAccordion("experience")}
              className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
            >
              <span className="font-bold text-zinc-100 text-[14px]">Professional Experience</span>
              {activeAccordion === "experience" ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {activeAccordion === "experience" && (
              <div className="p-5 border-t border-zinc-800/60 bg-zinc-950/20 space-y-6 animate-slide-down">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="border-b border-zinc-800 pb-5 last:border-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-amber-400 font-mono">Job Position</span>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Company Name</label>
                        <input
                           type="text"
                           value={exp.company}
                           onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Job Role / Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          placeholder="Jan 2023"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          disabled={exp.current}
                          placeholder="Present"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 disabled:bg-zinc-950/40"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="w-3.5 h-3.5 text-amber-500 border-zinc-800 bg-zinc-900 rounded focus:ring-amber-500"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-xs font-semibold text-zinc-400">I currently work here</label>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Bullet Achievements</label>
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() =>
                              handleAiImprove(exp.description, "action_verbs", exp.id, (txt) =>
                                updateExperience(exp.id, "description", txt)
                              )
                            }
                            disabled={isImproving === exp.id}
                            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            Action Verbs
                          </button>
                          <button
                            onClick={() =>
                              handleAiImprove(exp.description, "quantify", exp.id, (txt) =>
                                updateExperience(exp.id, "description", txt)
                              )
                            }
                            disabled={isImproving === exp.id}
                            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            Quantify
                          </button>
                          <button
                            onClick={() =>
                              handleAiImprove(exp.description, "improve", exp.id, (txt) =>
                                updateExperience(exp.id, "description", txt)
                              )
                            }
                            disabled={isImproving === exp.id}
                            className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            {isImproving === exp.id ? "Improving..." : "Magic Optimize"}
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        rows={4}
                        placeholder="• Spearheaded design of checkout system..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-sans leading-relaxed focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addExperience}
                  className="w-full py-2.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 hover:border-amber-500/30 hover:text-amber-400 text-zinc-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Professional Role
                </button>
              </div>
            )}
          </div>

          {/* Section: Projects */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleAccordion("projects")}
              className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
            >
              <span className="font-bold text-zinc-100 text-[14px]">Key Projects</span>
              {activeAccordion === "projects" ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {activeAccordion === "projects" && (
              <div className="p-5 border-t border-zinc-800/60 bg-zinc-950/20 space-y-6 animate-slide-down">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="border-b border-zinc-800 pb-5 last:border-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-amber-400 font-mono">Project Blueprint</span>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Project Role / Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Details & Achievements</label>
                        <button
                          onClick={() =>
                            handleAiImprove(proj.description, "improve", proj.id, (txt) =>
                              updateProject(proj.id, "description", txt)
                            )
                          }
                          disabled={isImproving === proj.id}
                          className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          {isImproving === proj.id ? "Optimizing..." : "Magic Optimize"}
                        </button>
                      </div>
                      <textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                        rows={3}
                        placeholder="• Built real-time compiler engine..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-sans leading-relaxed focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addProject}
                  className="w-full py-2.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 hover:border-amber-500/30 hover:text-amber-400 text-zinc-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Key Project
                </button>
              </div>
            )}
          </div>

          {/* Section: Education */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleAccordion("education")}
              className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
            >
              <span className="font-bold text-zinc-100 text-[14px]">Credentials & Education</span>
              {activeAccordion === "education" ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {activeAccordion === "education" && (
              <div className="p-5 border-t border-zinc-800/60 bg-zinc-950/20 space-y-6 animate-slide-down">
                {data.education.map((edu) => (
                  <div key={edu.id} className="border-b border-zinc-800 pb-5 last:border-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-amber-400 font-mono">Education Track</span>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Degree & Field</label>
                        <input
                          type="text"
                          value={edu.degree}
                          placeholder="Bachelor of Science"
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">GPA</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          placeholder="3.90/4.00"
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Graduation / Date</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          placeholder="May 2019"
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addEducation}
                  className="w-full py-2.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 hover:border-amber-500/30 hover:text-amber-400 text-zinc-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
            )}
          </div>

          {/* Section: Skills & Expertises */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleAccordion("skills")}
              className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
            >
              <span className="font-bold text-zinc-100 text-[14px]">Expertise & Technical Skills</span>
              {activeAccordion === "skills" ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {activeAccordion === "skills" && (
              <div className="p-5 border-t border-zinc-800/60 bg-zinc-950/20 space-y-4 animate-slide-down">
                {data.skills.map((sk) => (
                  <div key={sk.id} className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/80 space-y-3 relative">
                    <button
                      onClick={() => deleteSkillCategory(sk.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Skill Group Name</label>
                      <input
                        type="text"
                        value={sk.category}
                        onChange={(e) => updateSkillCategory(sk.id, "category", e.target.value)}
                        className="w-5/6 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Individual Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={sk.skills}
                        onChange={(e) => updateSkillCategory(sk.id, "skills", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSkillCategory}
                  className="w-full py-2.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 hover:border-amber-500/30 hover:text-amber-400 text-zinc-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Skill Category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: LIVE DYNAMIC PREVIEW & CONTROLS */}
        <div className="w-full md:w-1/2 bg-[#141418] overflow-hidden flex flex-col relative">
          {/* Zoom & View Layout control toolbar */}
          <div className="bg-zinc-950 border-b border-zinc-800/80 px-4 py-2 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-1.5 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/60">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors ${
                  previewMode === "desktop" ? "bg-zinc-950 border border-zinc-850 shadow-md shadow-amber-500/5 text-amber-400" : ""
                }`}
                title="Desktop Layout"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode("tablet")}
                className={`p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors ${
                  previewMode === "tablet" ? "bg-zinc-950 border border-zinc-850 shadow-md shadow-amber-500/5 text-amber-400" : ""
                }`}
                title="Tablet Layout"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors ${
                  previewMode === "mobile" ? "bg-zinc-950 border border-zinc-850 shadow-md shadow-amber-500/5 text-amber-400" : ""
                }`}
                title="Mobile Layout"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>

            {/* Slider zoom and values */}
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <button
                onClick={() => setZoom(Math.max(0.4, zoom - 0.05))}
                className="p-1 rounded hover:bg-zinc-900 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-zinc-200 select-none">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(1.5, zoom + 0.05))}
                className="p-1 rounded hover:bg-zinc-900 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render container */}
          <div className="flex-1 overflow-auto bg-[#141418] flex items-start justify-center p-4">
            <ResumeTemplateRenderer data={data} scale={zoom} previewMode={previewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
