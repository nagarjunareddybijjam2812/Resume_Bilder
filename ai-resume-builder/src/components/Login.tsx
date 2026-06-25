import React, { useState } from "react";
import { Sparkles, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onLogin(name.trim(), email.trim());
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* Radiant Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[200px] h-[200px] rounded-full bg-amber-600/5 blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-8 animate-fade-in">
        {/* Branding Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold shadow-xl shadow-amber-500/20 border border-amber-400/20">
            <Sparkles className="w-8 h-8 fill-current text-amber-100" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
              CareerCraft AI
            </h1>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              Premium Resume & Cover Letter Generator
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-[#09090b]/80 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 shadow-2xl space-y-6 relative">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Welcome to CareerCraft</h2>
            <p className="text-xs text-zinc-400">
              Please enter your name and email to access your personalized career command center.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs font-semibold text-rose-400 bg-rose-950/20 border border-rose-900/40 px-3.5 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-zinc-500" />
                <input
                  type="email"
                  placeholder="e.g. john.doe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/10 active:scale-95 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Local session secure. No credentials are transmitted.</span>
        </div>
      </div>
    </div>
  );
}
