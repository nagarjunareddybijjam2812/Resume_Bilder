import React, { useState, useRef, useEffect } from "react";
import { ResumeData } from "../types";
import { Send, Sparkles, MessageSquare, Trash2, Bot, User, Wand2, Star, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiAssistantProps {
  resume: ResumeData;
  onApplyImprovement?: (improvedText: string) => void;
}

export default function AiAssistant({ resume, onApplyImprovement }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your Senior Career Coach and ATS Recruiter AI. Paste any bullet points you want rewritten, ask for action verb replacements, ask how to align your experience with target companies (like Stripe, Google or Apple), or request help with optimizing your resume sections. How can I boost your career today? 🚀",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/resume/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          history: messages.slice(1), // Exclude the initial greeting
          resume,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.result }]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Sorry, I encountered an error: ${data.error}` },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't reach the AI server. Please make sure process.env.GEMINI_API_KEY is configured correctly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content: "History cleared. How can I help you customize or optimize your career profile?",
      },
    ]);
  };

  // Predefined prompts for quick action
  const PRESETS = [
    { label: "🔥 Quantify Stripe impact", text: "Help me rewrite my Stripe role bullets to sound extremely metrics-driven with realistic quantifiable metrics." },
    { label: "⚡ Strong action verbs", text: "Give me 10 elite action verbs suitable for a Senior Full-Stack Engineer and show how to use them." },
    { label: "🎯 Suggest executive summary", text: "Based on my resume, write a modern 3-sentence executive summary that stands out to tier-1 tech recruiters." },
    { label: "💎 ATS formatting tips", text: "What are the core formatting and layout issues I should avoid to ensure my resume passes modern ATS parsers?" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#09090b] border-l border-zinc-800/80 w-full animate-fade-in">
      {/* Sidebar Header */}
      <div className="bg-[#09090b] px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-zinc-100 text-[14px]">Executive AI Career Coach</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Coaching Powered by Gemini</span>
          </div>
        </div>

        <button
          onClick={clearHistory}
          title="Clear Conversation"
          className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                msg.role === "user"
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                  : "bg-amber-500 border-amber-400 text-zinc-950"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-1">
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                  msg.role === "user"
                    ? "bg-zinc-900 border-zinc-800 text-zinc-100 rounded-tr-none"
                    : "bg-zinc-950 border-zinc-800/80 text-zinc-200 rounded-tl-none shadow-sm"
                }`}
              >
                {/* Parse lines / bullet lists easily inside dialogue bubble */}
                <div className="space-y-1.5 whitespace-pre-wrap select-text">
                  {msg.content}
                </div>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono block text-right px-1">
                {msg.role === "user" ? "You" : "Senior AI Recruiter"}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-500 border-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-sm rounded-tl-none flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <span className="text-[10px] text-zinc-500 font-medium italic font-mono">Formulating responses...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Preset Action Suggestions */}
      {messages.length === 1 && !isLoading && (
        <div className="px-6 py-2 shrink-0">
          <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2">Suggested coaching sessions</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(preset.text)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[10.5px] font-bold shadow-sm transition-all active:scale-95"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="p-4 bg-[#09090b] border-t border-zinc-800/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Coach for custom rewrites, verbs, or template help..."
            className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md shadow-amber-500/10 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
