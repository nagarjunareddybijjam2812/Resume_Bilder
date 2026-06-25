import React, { useEffect, useState } from "react";

interface AtsGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export default function AtsGauge({
  score,
  size = 120,
  strokeWidth = 10,
  showText = true,
}: AtsGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth counter animation
    let start = 0;
    const duration = 1200; // ms
    const increment = score / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Color selection based on score
  const getColorClasses = (val: number) => {
    if (val >= 85) return { stroke: "url(#ats-success-grad)", text: "text-emerald-500", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (val >= 70) return { stroke: "url(#ats-warning-grad)", text: "text-amber-500", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    return { stroke: "url(#ats-danger-grad)", text: "text-rose-500", bg: "bg-rose-50 text-rose-700 border-rose-200" };
  };

  const currentColors = getColorClasses(animatedScore);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="ats-success-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="ats-warning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="ats-danger-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-100 fill-none"
            strokeWidth={strokeWidth}
          />
          {/* Animated Gauge */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-none transition-all duration-300 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={currentColors.stroke}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-display tracking-tight text-slate-900 leading-none">
            {animatedScore}
          </span>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
            ATS Score
          </span>
        </div>
      </div>

      {showText && (
        <span
          className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold border ${currentColors.bg}`}
        >
          {animatedScore >= 85 ? "ATS Optimized" : animatedScore >= 70 ? "Needs Polish" : "Critical Fixes Required"}
        </span>
      )}
    </div>
  );
}
