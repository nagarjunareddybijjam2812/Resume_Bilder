import React, { useState } from "react";
import { ResumeData, InterviewQuestion, MockInterviewResult } from "../types";
import { Sparkles, MessageSquare, RefreshCw, Send, CheckCircle2, Award, BookOpen, AlertCircle, Play, Mic, Video, Star, ThumbsUp, HelpCircle, ChevronRight } from "lucide-react";

interface InterviewModuleProps {
  resume: ResumeData;
}

export default function InterviewModule({ resume }: InterviewModuleProps) {
  const [jobTitle, setJobTitle] = useState(resume.personalInfo?.title || "");
  const [industry, setIndustry] = useState("Technology");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<MockInterviewResult | null>(null);

  const handleGenerateQuestions = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setEvalResult(null);
    setSelectedQuestion(null);
    setUserAnswer("");

    try {
      const response = await fetch("/api/resume/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobTitle, industry }),
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
        if (data.length > 0) {
          setSelectedQuestion(data[0]);
        }
      } else {
        alert("Failed to structure generated questions.");
      }
    } catch (e) {
      console.error(e);
      alert("Error calling interview prep endpoints.");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!selectedQuestion || !userAnswer.trim()) return;
    setEvalLoading(true);
    setEvalResult(null);

    try {
      // Prompt Gemini to grade the user's mock answer
      const systemInstruction = "You are CareerCraft's Principal Elite Tech Recruiter and Technical Interviewer.";
      const prompt = `Evaluate the candidate's answer to the following interview question.
Review how well they addressed key components, if they used STAR method (for behavioral queries), if they had technical depth, and how to improve.

Question: "${selectedQuestion.question}"
Category: ${selectedQuestion.category}
Ideal Points expected: ${JSON.stringify(selectedQuestion.idealPoints)}

Candidate Answer:
"${userAnswer}"

You must respond with valid JSON matching this schema:
{
  "score": number (0-100),
  "feedback": string (concise, professional constructive review of their answering details),
  "strengthPoints": string[] (2-3 key positive points about their response),
  "improvementPoints": string[] (2-3 precise ways they can elevate their answer, e.g. adding metrics, correcting terms)
}`;

      const response = await fetch("/api/resume/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          resume,
        }),
      });

      const data = await response.json();
      if (data.result) {
        // Safe parse
        const cleanJson = data.result.substring(data.result.indexOf("{"), data.result.lastIndexOf("}") + 1);
        const parsed = JSON.parse(cleanJson);
        setEvalResult(parsed);
      }
    } catch (e) {
      console.error(e);
      alert("Evaluation failed. Make sure your answer contains sufficient content.");
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8 animate-fade-in text-zinc-100">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 font-display">AI Interactive Mock Interview Simulator</h2>
        <p className="text-sm text-zinc-400">Practice behavioral, technical, and executive strategic queries. Receive instant score analytics and evaluations.</p>
      </div>

      {/* QUESTION CONFIGURATION AREA */}
      <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Target Job Role</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-250 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Industry Focus</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 bg-zinc-900 font-semibold"
            >
              <option value="Technology">Technology & SaaS</option>
              <option value="Finance">Finance & Banking</option>
              <option value="Consulting">Strategy & Consulting</option>
              <option value="Healthcare">Healthcare & Medicine</option>
              <option value="Startup">Early Stage Startup</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateQuestions}
          disabled={!jobTitle.trim() || loading}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Start Prep Session
            </>
          )}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* QUESTIONS LIST PANEL */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Interview Question Deck</h4>
            <div className="space-y-2">
              {questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setUserAnswer("");
                    setEvalResult(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-start gap-3 ${
                    selectedQuestion?.id === q.id
                      ? "bg-amber-500/10 border-amber-500/30 text-zinc-150 shadow-sm"
                      : "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                  }`}
                >
                  <div className="space-y-1 max-w-[85%]">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-[8px] font-extrabold uppercase font-mono tracking-wider text-amber-400">
                      {q.category}
                    </span>
                    <p className="text-xs font-bold leading-normal truncate">{q.question}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION CONSOLE PANEL */}
          <div className="lg:col-span-7 space-y-6">
            {selectedQuestion && (
              <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                {/* Active Question Title */}
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-extrabold uppercase tracking-widest font-mono">
                    {selectedQuestion.category} Question
                  </span>
                  <h3 className="text-md font-extrabold text-zinc-100 leading-snug">
                    {selectedQuestion.question}
                  </h3>
                </div>

                {/* Expectation bullets */}
                <div className="p-3.5 bg-zinc-950 border border-zinc-800/60 rounded-2xl space-y-2">
                  <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block">Interviewer expectations</span>
                  <div className="space-y-1">
                    {selectedQuestion.idealPoints.map((pt, idx) => (
                      <p key={idx} className="text-xs text-zinc-400 leading-relaxed flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{pt}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Answer Box */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Write Your Mock Response</label>
                    <span className="text-[9px] font-mono text-zinc-500">STAR method suggested</span>
                  </div>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows={6}
                    placeholder="Enter your mock answer here. Describe your achievements, actions, and quantifiable impacts clearly..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-500/50 placeholder-zinc-500 font-sans"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-1">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={!userAnswer.trim() || evalLoading}
                    className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {evalLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-current" /> Submit for Evaluation
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* EVALUATION ANALYSIS SCREEN */}
            {evalResult && (
              <div className="bg-[#0e0e11] border border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
                <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-950 text-amber-400 flex flex-col justify-center items-center font-display border border-zinc-800 shadow-inner">
                    <span className="text-lg font-extrabold leading-none">{evalResult.score}%</span>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Rating</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-zinc-100 text-md">Mock Performance Analytics</h4>
                    <p className="text-xs text-zinc-500">Graded according to industry standards and relevance metrics.</p>
                  </div>
                </div>

                {/* Score narrative */}
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider block">Recruiter review</span>
                  <p className="text-xs text-zinc-300 leading-relaxed italic whitespace-pre-wrap">{evalResult.feedback}</p>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl">
                    <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Strengths</span>
                    <div className="space-y-1">
                      {evalResult.strengthPoints?.map((pt, idx) => (
                        <p key={idx} className="text-xs text-zinc-350 leading-normal flex items-start gap-1.5">
                          <span className="text-emerald-500 shrink-0">•</span>
                          <span>{pt}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl">
                    <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Growth Gaps</span>
                    <div className="space-y-1">
                      {evalResult.improvementPoints?.map((pt, idx) => (
                        <p key={idx} className="text-xs text-zinc-350 leading-normal flex items-start gap-1.5">
                          <span className="text-amber-500 shrink-0">•</span>
                          <span>{pt}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
