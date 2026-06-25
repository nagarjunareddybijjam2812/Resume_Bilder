import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up Gemini AI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Use robust body limit for larger resumes and copy-pasted JDs
app.use(express.json({ limit: "20mb" }));

// Helper to check for API key
function verifyApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured in environment variables. Please add it in Settings > Secrets.",
    });
  }
  next();
}

// ==========================================
// API ENDPOINT: HEALTH CHECK
// ==========================================
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", keyAvailable: !!process.env.GEMINI_API_KEY });
});

// ==========================================
// API ENDPOINT: AI RESUME REWRITE & IMPROVE
// ==========================================
app.post("/api/resume/improve", verifyApiKey, async (req, res) => {
  try {
    const { text, type, context } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided for improvement." });
    }

    let instruction = "";
    switch (type) {
      case "expand":
        instruction = "Expand the following resume bullet point/text to make it sound more comprehensive and professional. Ensure you add detail while retaining accuracy. Do not use filler words. Keep it to 1-2 impactful sentences.";
        break;
      case "condense":
        instruction = "Condense the following resume bullet point/text. Make it highly punchy, clear, and direct. Eliminate wordiness, but preserve key metrics and accomplishments.";
        break;
      case "action_verbs":
        instruction = "Rewrite the following text specifically starting with strong industry action verbs (e.g., 'Spearheaded', 'Optimized', 'Designed', 'Architected'). Make it sound energetic and results-driven.";
        break;
      case "quantify":
        instruction = "Rewrite the following text to prioritize quantifiable achievements and impact. If metrics aren't provided, intelligently inject realistic placeholders in brackets (e.g., '[X]% increase' or '[Y] million dollars') to show the user where they should include numbers.";
        break;
      case "improve":
      default:
        instruction = "Optimize and improve the grammar, professional tone, and impact of this resume text. Make it sound like it was written by an elite, executive-level editor.";
        break;
    }

    if (context) {
      instruction += ` Context / Role Info: ${context}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: `${instruction}\n\nOriginal Text:\n"${text}"` }
      ],
      config: {
        temperature: 0.7,
      },
    });

    res.json({ result: response.text?.trim() });
  } catch (error: any) {
    console.error("Improve API error:", error);
    res.status(500).json({ error: error.message || "Failed to improve text." });
  }
});

// ==========================================
// API ENDPOINT: ATS ANALYZER (circular gauge + stats)
// ==========================================
app.post("/api/resume/ats", verifyApiKey, async (req, res) => {
  try {
    const { resume } = req.body;
    if (!resume) {
      return res.status(400).json({ error: "Resume data is required." });
    }

    const prompt = `Analyze the following resume JSON for Applicant Tracking System (ATS) optimization, professional parsing readiness, formatting accuracy, and overall content impact.
Provide a thorough and constructive score and breakdown.

Resume details:
${JSON.stringify(resume, null, 2)}

You must respond with valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "formatting": { "score": number, "rating": string, "feedback": string[] },
  "keywords": { "score": number, "rating": string, "feedback": string[] },
  "skills": { "score": number, "rating": string, "feedback": string[] },
  "readability": { "score": number, "rating": string, "feedback": string[] },
  "grammar": { "score": number, "rating": string, "feedback": string[] },
  "experienceQuality": { "score": number, "rating": string, "feedback": string[] },
  "strengths": string[],
  "weaknesses": string[],
  "criticalIssues": string[],
  "suggestions": [
    { "section": "Formatting" | "Keywords" | "Skills" | "Readability" | "Grammar" | "Experience", "issue": string, "fix": string }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("ATS Analyzer error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze ATS score." });
  }
});

// ==========================================
// API ENDPOINT: JOB MATCH ANALYZER
// ==========================================
app.post("/api/resume/jobmatch", verifyApiKey, async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Both resume data and job description are required." });
    }

    const prompt = `Compare the following resume against the provided Job Description (JD).
Intelligently extract the required skills, soft skills, technologies, and responsibilities from the job description and compare them against the resume to generate a match percentage, keyword gaps, and high-impact optimization recommendations.

Resume Details:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}

You must respond with valid JSON matching this schema:
{
  "matchPercentage": number (0-100),
  "extractedRole": string (e.g. "Senior Software Engineer"),
  "extractedSeniority": string (e.g. "Senior", "Mid-Level", "Junior"),
  "matchingStrength": string (e.g. "High", "Moderate", "Low"),
  "requiredSkills": [
    { "name": "Skill Name", "present": true/false }
  ],
  "missingKeywords": string[] (list of important skills/keywords from the job description that are missing or weak in the resume),
  "suggestedImprovements": string[] (actionable checklist of things the user can add or rewrite to match this specific job description)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Job Match API error:", error);
    res.status(500).json({ error: error.message || "Failed to match job description." });
  }
});

// ==========================================
// API ENDPOINT: COVER LETTER GENERATOR
// ==========================================
app.post("/api/resume/coverletter", verifyApiKey, async (req, res) => {
  try {
    const { resume, recipientName, recipientTitle, companyName, companyAddress, date, tone } = req.body;
    if (!resume) {
      return res.status(400).json({ error: "Resume data is required to construct a cover letter." });
    }

    const toneInstruction = {
      Professional: "Write in a highly polished, professional, and respectful corporate tone. Suitable for finance, consulting, and traditional industries.",
      Friendly: "Write in an approachable, warm, yet professional tone. Suitable for collaborative startups or close-knit teams.",
      Executive: "Write with elite executive presence. Bold, results-driven, focusing heavily on leadership, high-impact strategies, and business outcomes.",
      Technical: "Focus deeply on technology, methodologies, problem-solving, and engineering craft. Perfect for developers, IT, and software architectures.",
      Creative: "Write with a unique storytelling angle, showing immense passion, drive, and an out-of-the-box personality. Suitable for marketing, design, or brand roles.",
    }[tone as "Professional" | "Friendly" | "Executive" | "Technical" | "Creative"] || "Write in a balanced, highly professional tone.";

    const prompt = `Generate a world-class, premium cover letter for a candidate based on their resume profile.
The cover letter should look modern, focus on their primary achievements, connect their strengths to the target company, and feel fully authentic (not robotic or cookie-cutter).

Candidate Details:
Name: ${resume.personalInfo?.name}
Current Role: ${resume.personalInfo?.title || "Professional"}
Experience: ${JSON.stringify(resume.experience, null, 2)}
Skills: ${JSON.stringify(resume.skills, null, 2)}

Target Details:
Company Name: ${companyName || "Target Company"}
Recipient Name: ${recipientName || "Hiring Team"}
Recipient Title: ${recipientTitle || "Hiring Manager"}
Company Address: ${companyAddress || ""}
Date: ${date || "Current Date"}

Tone & Style Guidance:
${toneInstruction}

Please output ONLY the body of the cover letter (including standard professional salutations and closings, but excluding header contact information blocks if you prefer, so it's easy to place in standard templates). Keep it around 300-400 words, broken into 3-4 impactful paragraphs (Hook, Key Value Proposition/Story, Company Alignment, Call to Action).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.75,
      },
    });

    res.json({ result: response.text?.trim() });
  } catch (error: any) {
    console.error("Cover Letter Generator API error:", error);
    res.status(500).json({ error: error.message || "Failed to generate cover letter." });
  }
});

// ==========================================
// API ENDPOINT: LINKEDIN PROFILE OPTIMIZER
// ==========================================
app.post("/api/resume/linkedin", verifyApiKey, async (req, res) => {
  try {
    const { resume } = req.body;
    if (!resume) {
      return res.status(400).json({ error: "Resume data is required." });
    }

    const prompt = `Review the candidate's professional resume profile and generate premium recommendations and ready-to-use content to optimize their LinkedIn presence for maximum recruiter discoverability, search engine optimization (SEO), and conversion.

Resume Details:
${JSON.stringify(resume, null, 2)}

You must respond with valid JSON matching this schema:
{
  "profileScore": number (0-100),
  "headlineSuggestions": string[] (provide 3 compelling, SEO-optimized, hook-focused LinkedIn headlines using keywords and value-add formulas),
  "aboutSection": string (a comprehensive, high-engagement 'About' section written in first-person ('I'). It should start with a strong hook, detail their core achievements, key expertise with a bullet list of specialties, and end with a call to action),
  "experienceImprovements": [
    { "before": string, "after": string, "impact": string }
  ] (provide 3 concrete examples of how to rewrite experience bullets for LinkedIn's layout, showing 'Before', 'After', and the 'Impact' reason),
  "seoKeywords": string[] (list of 8-10 high-traffic search terms recruiter use for this industry/role to sprinkle throughout their profile),
  "profileCompletenessTips": string[] (3-4 highly specific tips like customized URL, header banner advice, skills endorsements, and recommendation tactics)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("LinkedIn Optimizer API error:", error);
    res.status(500).json({ error: error.message || "Failed to optimize LinkedIn content." });
  }
});

// ==========================================
// API ENDPOINT: INTERVIEW PREPARER
// ==========================================
app.post("/api/resume/interview", verifyApiKey, async (req, res) => {
  try {
    const { resume, jobTitle, industry, jobDescription } = req.body;
    if (!resume) {
      return res.status(400).json({ error: "Resume is required." });
    }

    const prompt = `Generate a set of 5 highly tailored, high-caliber interview questions specifically for this candidate based on their resume and target role/industry.
Generate:
- 1 HR/Icebreaker Question
- 2 Behavioral (STAR-method focused) Questions
- 1 Technical or Domain-Specific Question
- 1 Company-Specific or Complex Strategic Question

Resume Details:
${JSON.stringify(resume, null, 2)}

Target Details:
Job Title: ${jobTitle || resume.personalInfo?.title || "Professional"}
Industry: ${industry || "Technology"}
Job Description Context: ${jobDescription || "Not provided"}

You must respond with valid JSON matching this schema:
[
  {
    "id": string (unique ID e.g. "q1", "q2"),
    "question": string,
    "category": "Technical" | "Behavioral" | "HR" | "Company-Specific",
    "idealPoints": string[] (list of 3 key elements the interviewer is looking for in a top-tier answer),
    "sampleAnswer": string (a concise, premium example of how the candidate could answer this question using STAR method where appropriate)
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "[]");
    res.json(parsed);
  } catch (error: any) {
    console.error("Interview Prep API error:", error);
    res.status(500).json({ error: error.message || "Failed to generate interview prep." });
  }
});

// ==========================================
// API ENDPOINT: AI ASSISTANT CHAT
// ==========================================
app.post("/api/resume/chat", verifyApiKey, async (req, res) => {
  try {
    const { message, history, resume } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const systemInstruction = `You are CareerCraft's Senior Executive Career Coach and Recruiter AI.
Your goal is to assist the user in crafting a world-class resume, solving ATS parsing issues, optimizing experience bullet points, selecting the right template, optimizing LinkedIn profiles, prepping for high-stakes interviews, and landing their dream job.

The user's current resume in editing is:
${JSON.stringify(resume, null, 2)}

Always keep your tone encouraging, highly elite, sharp, and results-focused. Provide direct, bulleted, action-oriented feedback rather than verbose paragraphs. Keep answers concise, direct, and elite. Customize your suggestions to their actual experience. If they ask to rewrite a bullet, generate several premium alternatives immediately. Use formatting (bolding, spacing) beautifully to make your output extremely readable.`;

    // Convert client-provided history to Gemini format if present, otherwise just send full payload
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // For a single call with history, we can pass previous contents or leverage chats.create.
    // For simplicity and robustness, we construct the full contents list
    const contents = [
      ...formattedHistory,
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message || "Failed to run chat assistant." });
  }
});

// ==========================================
// VITE DEV / PROD WEB SERVER INTEGRATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve compiled build assets in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`World-Class AI Resume Builder Server running on http://localhost:${PORT}`);
  });
}

startServer();
