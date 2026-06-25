import React from "react";
import { ResumeData } from "../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface ResumeTemplateRendererProps {
  data: ResumeData;
  scale?: number; // Zoom multiplier (e.g. 1.0, 0.8)
  previewMode?: "desktop" | "tablet" | "mobile" | "print";
}

export default function ResumeTemplateRenderer({
  data,
  scale = 1.0,
  previewMode = "desktop",
}: ResumeTemplateRendererProps) {
  const { personalInfo, summary, experience, education, projects, skills, certifications, awards, languages, interests } = data;
  const themeColor = data.colorTheme || "#2563EB";

  // Dynamic style matching based on scale
  const styleWrapper = {
    transform: `scale(${scale})`,
    transformOrigin: "top center",
    transition: "transform 0.2s ease",
  };

  const getFontFamily = () => {
    switch (data.templateId) {
      case "executive-serif":
        return {
          header: "font-display font-bold font-serif text-slate-900",
          sub: "font-serif text-slate-700 italic",
          body: "font-sans leading-relaxed text-slate-800 text-[13px]",
          title: "font-serif border-b pb-1 font-bold tracking-wide border-slate-300 uppercase text-[15px]",
        };
      case "startup-tech":
        return {
          header: "font-mono font-bold tracking-tight text-slate-900 uppercase",
          sub: "font-mono text-xs text-slate-600",
          body: "font-sans leading-relaxed text-slate-700 text-[13px]",
          title: "font-mono tracking-wider font-bold border-l-4 pl-2 uppercase text-[14px]",
        };
      case "creative-brand":
        return {
          header: "font-display font-extrabold tracking-tight text-slate-900 text-3xl",
          sub: "font-sans font-semibold text-slate-600",
          body: "font-sans leading-relaxed text-slate-700 text-[13px]",
          title: "font-display tracking-tight font-extrabold text-[15px]",
        };
      case "modern-minimalist":
      default:
        return {
          header: "font-display font-extrabold tracking-tight text-slate-900",
          sub: "font-sans font-medium text-slate-500",
          body: "font-sans leading-relaxed text-slate-700 text-[13px]",
          title: "font-display tracking-tight font-bold border-b pb-1.5 uppercase text-[14px]",
        };
    }
  };

  const fonts = getFontFamily();

  // Helper to split bullet points
  const renderBullets = (text: string) => {
    if (!text) return null;
    const bullets = text.split("\n").filter((line) => line.trim().length > 0);
    return (
      <ul className="space-y-1 mt-1.5 list-disc pl-5">
        {bullets.map((bullet, idx) => (
          <li key={idx} className={`${fonts.body}`}>
            {bullet.replace(/^•\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  // Render Modern Minimalist Template
  const renderModernMinimalist = () => (
    <div className="p-10 bg-white h-full shadow-sm text-slate-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`${fonts.header} text-3xl font-bold tracking-tight`} style={{ color: themeColor }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <p className={`${fonts.sub} text-md mt-1 tracking-wide uppercase font-semibold`}>
          {personalInfo.title || "Target Professional Title"}
        </p>

        {/* Contact Info Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-4 text-[12px] text-slate-500 font-medium">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> {personalInfo.website}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5" /> {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> {personalInfo.github}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className={`${fonts.title} mb-2.5 font-bold`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
            Professional Summary
          </h2>
          <p className={fonts.body}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className={`${fonts.title} mb-3 font-bold`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="flex justify-between items-baseline font-semibold text-[14px]">
                  <span className="text-slate-800 font-bold">{exp.role}</span>
                  <span className="text-slate-500 text-[12px] font-normal">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[12.5px] text-slate-600 italic">
                  <span>{exp.company}</span>
                  <span className="font-normal text-slate-400 text-[11.5px]">{exp.location}</span>
                </div>
                {renderBullets(exp.description)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className={`${fonts.title} mb-3 font-bold`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
            Key Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-semibold text-[14px]">
                  <span className="text-slate-800 font-bold">{proj.name}</span>
                  {proj.link && <span className="text-slate-400 text-[11px] font-normal">{proj.link}</span>}
                </div>
                {proj.role && <p className="text-[12px] text-slate-500 italic mt-0.5">{proj.role}</p>}
                {renderBullets(proj.description)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Section for Education/Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className={`${fonts.title} mb-2.5 font-bold`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline font-semibold text-[13px]">
                      <span className="text-slate-800 font-bold">{edu.degree} in {edu.field}</span>
                      <span className="text-slate-500 text-[11px] font-normal">
                        {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-[12px] text-slate-600">
                      <span>{edu.school}</span>
                      {edu.gpa && <span className="text-slate-400 text-[11px]">GPA: {edu.gpa}</span>}
                    </div>
                    {edu.description && <p className={`${fonts.body} mt-1 text-[12px] text-slate-500`}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Awards */}
          {(certifications.length > 0 || awards.length > 0) && (
            <div className="mb-6">
              <h2 className={`${fonts.title} mb-2.5 font-bold`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                Certifications & Awards
              </h2>
              <ul className="space-y-1 list-disc pl-5 text-[12.5px] text-slate-700">
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <span className="font-semibold">{cert.name}</span> – {cert.issuer} ({cert.date})
                  </li>
                ))}
                {awards.map((aw) => (
                  <li key={aw.id}>
                    <span className="font-semibold">{aw.title}</span> – {aw.issuer} ({aw.date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className={`${fonts.title} mb-2.5 font-bold`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                Expertise & Skills
              </h2>
              <div className="space-y-2.5">
                {skills.map((sk) => (
                  <div key={sk.id}>
                    <h4 className="text-[12.5px] font-bold text-slate-700 uppercase tracking-wider">{sk.category}</h4>
                    <p className="text-[12.5px] text-slate-600 leading-normal mt-0.5">{sk.skills}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages & Interests */}
          {(languages.length > 0 || interests) && (
            <div className="mb-6">
              <h2 className={`${fonts.title} mb-2.5 font-bold`} style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                Languages & Interests
              </h2>
              {languages.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-[12px] font-bold text-slate-600 uppercase">Languages</h4>
                  <p className="text-[12.5px] text-slate-600">
                    {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
                  </p>
                </div>
              )}
              {interests && (
                <div>
                  <h4 className="text-[12px] font-bold text-slate-600 uppercase">Interests</h4>
                  <p className="text-[12.5px] text-slate-600">{interests}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render Executive Serif Template
  const renderExecutiveSerif = () => (
    <div className="p-12 bg-white h-full shadow-sm text-slate-900 font-serif">
      {/* Header */}
      <div className="border-b-2 border-double pb-4 mb-6 border-slate-300 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900" style={{ color: themeColor }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-slate-600 text-sm tracking-widest uppercase mt-1.5 font-sans font-medium">
          {personalInfo.title || "Target Professional Title"}
        </p>

        {/* Contact Info Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className={`${fonts.title} text-slate-800`} style={{ borderColor: themeColor }}>
            Executive Statement
          </h2>
          <p className={`${fonts.body} mt-2 text-justify text-[13.5px]`}>{summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className={`${fonts.title} text-slate-800`} style={{ borderColor: themeColor }}>
            Professional History
          </h2>
          <div className="space-y-4 mt-2">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[14px] text-slate-900">
                    {exp.role} <span className="font-normal text-slate-500 italic">at {exp.company}</span>
                  </h3>
                  <span className="text-[12px] font-sans text-slate-500 font-medium">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-[11.5px] font-sans text-slate-400 mt-0.5">{exp.location}</div>
                {renderBullets(exp.description)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className={`${fonts.title} text-slate-800`} style={{ borderColor: themeColor }}>
            Credentials & Education
          </h2>
          <div className="space-y-3 mt-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-[13.5px] text-slate-900">
                    {edu.school} – <span className="font-normal italic text-slate-600">{edu.degree} in {edu.field}</span>
                  </h4>
                  <span className="text-[11.5px] font-sans text-slate-500">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mt-0.5 text-[11.5px] text-slate-500 font-sans">
                  <span>{edu.location}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className={`${fonts.title} text-slate-800`} style={{ borderColor: themeColor }}>
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-2 font-sans">
            {skills.map((sk) => (
              <div key={sk.id} className="text-xs">
                <span className="font-bold text-slate-700 tracking-wide block uppercase text-[10.5px]">{sk.category}</span>
                <span className="text-slate-600 block mt-0.5 text-[12px]">{sk.skills}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards & Languages footer */}
      {(certifications.length > 0 || awards.length > 0 || languages.length > 0) && (
        <div>
          <h2 className={`${fonts.title} text-slate-800`} style={{ borderColor: themeColor }}>
            Additional Profile Assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-xs font-sans text-slate-600">
            {certifications.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 block uppercase text-[10px]">Certifications</span>
                {certifications.map(c => (
                  <p key={c.id} className="mt-0.5 text-[11.5px]">{c.name} ({c.issuer})</p>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 block uppercase text-[10px]">Languages & Interests</span>
                <p className="mt-0.5 text-[11.5px]">
                  {languages.map(l => `${l.name} (${l.level})`).join(", ")}
                </p>
                {interests && <p className="mt-1 text-slate-400 text-[11px]">Interests: {interests}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render Startup Tech (Linear Style)
  const renderStartupTech = () => (
    <div className="bg-slate-950 p-10 h-full shadow-lg text-slate-200 font-sans relative overflow-hidden">
      {/* Decorative tech grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column (Meta & Info) */}
        <div className="md:col-span-4 border-r border-slate-800 pr-6 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase font-mono">
              {personalInfo.name || "Name"}
            </h1>
            <p className="text-xs font-mono tracking-widest uppercase mt-1.5 text-slate-400" style={{ color: themeColor }}>
              {personalInfo.title || "Target Role"}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 text-[11.5px] font-mono text-slate-400">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1 font-mono">Contact</h4>
            {personalInfo.email && <div className="truncate">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.website && <div className="text-blue-400 hover:underline">{personalInfo.website}</div>}
            {personalInfo.linkedin && <div className="truncate text-blue-400 hover:underline">{personalInfo.linkedin}</div>}
            {personalInfo.github && <div className="truncate text-slate-300 hover:underline">{personalInfo.github}</div>}
          </div>

          {/* Skills categories */}
          {skills.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1 font-mono">Skills Network</h4>
              {skills.map((sk) => (
                <div key={sk.id} className="space-y-1">
                  <span className="text-[11px] font-mono font-semibold text-slate-300">{sk.category}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {sk.skills.split(",").map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1 font-mono">Education</h4>
              {education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-1">
                  <p className="font-bold text-slate-200">{edu.degree} in {edu.field}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{edu.school}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Achievements) */}
        <div className="md:col-span-8 space-y-6">
          {summary && (
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-2">Summary // Executive Directive</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-1.5">Employment Record</h4>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1 border-l-2 pl-4 py-0.5" style={{ borderColor: themeColor }}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-100 text-[13.5px]">{exp.role}</span>
                      <span className="text-[10.5px] font-mono text-slate-500">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[12px] text-slate-400 font-mono">
                      {exp.company} <span className="text-[10px] text-slate-600 font-normal">[{exp.location}]</span>
                    </div>
                    <div className="text-slate-300 space-y-1 mt-1.5 text-xs">
                      {exp.description.split("\n").map((b, i) => (
                        <p key={i} className="flex gap-2 leading-relaxed">
                          <span className="text-blue-500">›</span>
                          <span>{b.replace(/^•\s*/, "")}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-1.5">Repositories & Deployments</h4>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-200 text-xs">{proj.name}</span>
                      {proj.link && <span className="text-[10px] font-mono text-blue-400">{proj.link}</span>}
                    </div>
                    {proj.role && <p className="text-[10.5px] text-slate-500 font-mono italic mt-0.5">{proj.role}</p>}
                    <div className="text-slate-300 space-y-1 mt-1.5 text-xs">
                      {proj.description.split("\n").map((b, i) => (
                        <p key={i} className="flex gap-2 leading-normal">
                          <span className="text-slate-600">›</span>
                          <span>{b.replace(/^•\s*/, "")}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render Creative Brand Template
  const renderCreativeBrand = () => (
    <div className="p-10 bg-white h-full shadow-sm text-slate-800 font-sans">
      {/* Visual top bar of theme color */}
      <div className="h-2 rounded-t-lg -mt-10 -mx-10 mb-8" style={{ backgroundColor: themeColor }}></div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.name || "Your Name"}
            </h1>
            <p className="text-md mt-1.5 font-bold tracking-tight uppercase" style={{ color: themeColor }}>
              {personalInfo.title || "Target Professional Title"}
            </p>
          </div>

          {summary && (
            <div className="bg-slate-50 border-l-4 p-4 rounded-r-xl" style={{ borderColor: themeColor }}>
              <h3 className="text-xs uppercase font-extrabold text-slate-400 mb-1 tracking-wider">About Me</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed italic">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 border-b pb-1 mb-3">Professional Story</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: `${themeColor}40` }}>
                    {/* Small circle dot accent */}
                    <div className="absolute w-2.5 h-2.5 rounded-full -left-[6px] top-1.5 border" style={{ backgroundColor: themeColor, borderColor: "white" }}></div>
                    <div className="flex justify-between items-baseline font-bold text-[13.5px]">
                      <span className="text-slate-800">{exp.role}</span>
                      <span className="text-slate-500 text-[11px] font-normal">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[12px] font-semibold text-slate-500 italic">
                      {exp.company}, {exp.location}
                    </div>
                    {renderBullets(exp.description)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 border-b pb-1 mb-3">Venture & Projects</h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-baseline font-bold text-[13px]">
                      <span className="text-slate-800">{proj.name}</span>
                      {proj.link && <span className="text-[11px] font-normal text-slate-400">{proj.link}</span>}
                    </div>
                    {renderBullets(proj.description)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (visual blocks) */}
        <div className="w-full md:w-64 space-y-6">
          {/* Contacts Box */}
          <div className="p-4 rounded-2xl bg-slate-50 space-y-3 text-xs text-slate-600 border border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Connect</h4>
            {personalInfo.email && <p className="truncate flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" /> {personalInfo.email}</p>}
            {personalInfo.phone && <p className="truncate flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> {personalInfo.phone}</p>}
            {personalInfo.location && <p className="truncate flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" /> {personalInfo.location}</p>}
            {personalInfo.website && <p className="truncate flex items-center gap-2 text-slate-500 hover:underline"><Globe className="w-3.5 h-3.5 shrink-0" /> {personalInfo.website}</p>}
            {personalInfo.linkedin && <p className="truncate flex items-center gap-2 text-slate-500 hover:underline"><Linkedin className="w-3.5 h-3.5 shrink-0" /> {personalInfo.linkedin}</p>}
          </div>

          {/* Skills box */}
          {skills.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 space-y-4 border border-slate-100">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Core Skills</h4>
              {skills.map((sk) => (
                <div key={sk.id} className="space-y-1">
                  <span className="text-[11.5px] font-bold text-slate-600">{sk.category}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sk.skills.split(",").map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-full text-white font-medium" style={{ backgroundColor: themeColor }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education Block */}
          {education.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Education</h4>
              {education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-700">{edu.degree}</p>
                  <p className="text-slate-500">{edu.field}</p>
                  <p className="text-slate-400 italic text-[11px]">{edu.school}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getTemplateLayout = () => {
    switch (data.templateId) {
      case "executive-serif":
        return renderExecutiveSerif();
      case "startup-tech":
        return renderStartupTech();
      case "creative-brand":
        return renderCreativeBrand();
      case "modern-minimalist":
      default:
        return renderModernMinimalist();
    }
  };

  // Outer container size handling for Preview mode
  const getContainerClass = () => {
    switch (previewMode) {
      case "tablet":
        return "w-[680px] min-h-[960px]";
      case "mobile":
        return "w-[360px] min-h-[640px]";
      case "print":
      case "desktop":
      default:
        return "w-[800px] min-h-[1050px]";
    }
  };

  return (
    <div className="flex justify-center items-start overflow-auto h-full p-6 bg-slate-100 select-text">
      <div
        id="resume-render-target"
        className={`${getContainerClass()} shadow-2xl rounded-sm transition-all duration-300 bg-white relative`}
        style={styleWrapper}
      >
        {getTemplateLayout()}
      </div>
    </div>
  );
}
