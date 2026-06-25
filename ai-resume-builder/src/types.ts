export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // bullet points separated by newlines
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  link: string;
  description: string; // bullet points separated by newlines
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string; // comma-separated
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  level: string; // Native, Fluent, Intermediate, Basic
}

export interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  colorTheme: string;
  lastEdited: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
  interests: string; // comma-separated
}

// ATS Analyzer types
export interface AtsSectionScore {
  score: number;
  rating: string;
  feedback: string[];
}

export interface AtsAnalysisResult {
  overallScore: number;
  formatting: AtsSectionScore;
  keywords: AtsSectionScore;
  skills: AtsSectionScore;
  readability: AtsSectionScore;
  grammar: AtsSectionScore;
  experienceQuality: AtsSectionScore;
  strengths: string[];
  weaknesses: string[];
  criticalIssues: string[];
  suggestions: {
    section: string;
    issue: string;
    fix: string;
  }[];
}

// Job Match types
export interface JobMatchResult {
  matchPercentage: number;
  extractedRole: string;
  extractedSeniority: string;
  matchingStrength: string;
  requiredSkills: { name: string; present: boolean }[];
  missingKeywords: string[];
  suggestedImprovements: string[];
}

// Cover Letter types
export interface CoverLetterData {
  id: string;
  title: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  body: string;
}

// LinkedIn Optimizer types
export interface LinkedInResult {
  profileScore: number;
  headlineSuggestions: string[];
  aboutSection: string;
  experienceImprovements: { before: string; after: string; impact: string }[];
  seoKeywords: string[];
  profileCompletenessTips: string[];
}

// Interview Prep types
export interface InterviewQuestion {
  id: string;
  question: string;
  category: "Technical" | "Behavioral" | "HR" | "Company-Specific";
  idealPoints: string[];
  sampleAnswer?: string;
}

export interface MockInterviewResult {
  score: number;
  feedback: string;
  strengthPoints: string[];
  improvementPoints: string[];
}
