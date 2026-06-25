import React, { useState } from "react";
import { ResumeData } from "../types";
import { X, FileText, Download, Copy, Check, Share2, Printer, Cloud, ArrowUpRight, HelpCircle } from "lucide-react";

interface ExportModalProps {
  resume: ResumeData;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ resume, isOpen, onClose }: ExportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [exportingType, setExportingType] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerPrint = () => {
    setExportingType("pdf");
    setTimeout(() => {
      window.print();
      setExportingType(null);
    }, 800);
  };

  const downloadText = () => {
    setExportingType("txt");
    setTimeout(() => {
      // Create readable resume plain text format
      let txt = `${resume.personalInfo.name.toUpperCase()}\n`;
      txt += `${resume.personalInfo.title}\n`;
      txt += `${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}\n`;
      if (resume.personalInfo.website) txt += `${resume.personalInfo.website} | `;
      if (resume.personalInfo.linkedin) txt += `${resume.personalInfo.linkedin}\n`;
      txt += `\n========================================\n`;
      txt += `PROFESSIONAL SUMMARY\n`;
      txt += `========================================\n\n`;
      txt += `${resume.summary}\n\n`;

      txt += `========================================\n`;
      txt += `PROFESSIONAL EXPERIENCE\n`;
      txt += `========================================\n\n`;
      resume.experience.forEach((exp) => {
        txt += `${exp.role} - ${exp.company} (${exp.location})\n`;
        txt += `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}\n`;
        txt += `${exp.description}\n\n`;
      });

      txt += `========================================\n`;
      txt += `EDUCATION\n`;
      txt += `========================================\n\n`;
      resume.education.forEach((edu) => {
        txt += `${edu.degree} in ${edu.field}\n`;
        txt += `${edu.school} (${edu.location}) - GPA: ${edu.gpa}\n`;
        txt += `${edu.startDate} - ${edu.endDate}\n\n`;
      });

      const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.title.replace(/\s+/g, "_")}.txt`;
      link.click();
      setExportingType(null);
    }, 1000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://careercraft.io/share/${resume.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up relative">
        {/* Header strip */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 text-lg font-display">Export & Share Professional Assets</h3>
            <p className="text-xs text-slate-500">Select your preferred high-impact format. Approved for recruiter databases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action Card: PDF Print */}
            <button
              onClick={triggerPrint}
              disabled={!!exportingType}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-200 text-left space-y-3 hover:bg-slate-50/50 transition-all flex flex-col justify-between"
            >
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-10 h-10 flex items-center justify-center shadow-inner">
                <Printer className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  Download PDF
                </p>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Prints the resume with pixel-perfect layouts directly to paper or PDF files.
                </p>
              </div>
            </button>

            {/* Action Card: Plain TXT */}
            <button
              onClick={downloadText}
              disabled={!!exportingType}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-200 text-left space-y-3 hover:bg-slate-50/50 transition-all flex flex-col justify-between"
            >
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 w-10 h-10 flex items-center justify-center shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-xs">Plain TXT File</p>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Standard ASCII TXT file, perfect for copy-pasting directly into legacy ATS boxes.
                </p>
              </div>
            </button>
          </div>

          {/* Social Share & Cloud Save options */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share & Save Channels</h4>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={copyShareLink}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" /> Copied link!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" /> Copy Share Link
                  </>
                )}
              </button>

              <button
                disabled
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 opacity-40 select-none cursor-not-allowed"
              >
                <Cloud className="w-4 h-4 text-slate-400" /> Save to Career Cloud
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
