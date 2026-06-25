import { ResumeData } from "./types";

export interface TemplateSpec {
  id: string;
  name: string;
  category: string;
  description: string;
  popularity: number;
  atsRating: number;
  premium: boolean;
  colorOptions: string[];
}

export const TEMPLATES: TemplateSpec[] = [
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    category: "Minimal",
    description: "Sleek single-column design with elegant spacing and subtle typography accents. Maximum ATS readability.",
    popularity: 98,
    atsRating: 99,
    premium: false,
    colorOptions: ["#1e293b", "#2563EB", "#10B981", "#7c3aed"],
  },
  {
    id: "executive-serif",
    name: "Executive Serif",
    category: "Executive",
    description: "Classic high-end editorial format featuring premium Serif headings. Perfect for legal, finance, and senior leadership.",
    popularity: 92,
    atsRating: 96,
    premium: true,
    colorOptions: ["#0f172a", "#1e40af", "#065f46", "#881337"],
  },
  {
    id: "startup-tech",
    name: "Startup Tech",
    category: "Software Engineer",
    description: "Sleek monospace details with accent vertical sidebars, designed for fast-paced engineering and product teams.",
    popularity: 95,
    atsRating: 95,
    premium: false,
    colorOptions: ["#0f172a", "#3b82f6", "#ec4899", "#10b981"],
  },
  {
    id: "creative-brand",
    name: "Creative Brand",
    category: "Creative",
    description: "A distinctive grid style with modern color blocks and rounded visual tag layouts. Stands out for designers and marketing.",
    popularity: 88,
    atsRating: 85,
    premium: true,
    colorOptions: ["#7c3aed", "#ec4899", "#f59e0b", "#06b6d4"],
  }
];

export const MOCK_RESUMES: ResumeData[] = [
  {
    id: "john-doe-primary",
    title: "Senior Full-Stack Engineer Resume",
    templateId: "modern-minimalist",
    colorTheme: "#2563EB",
    lastEdited: "June 25, 2026",
    personalInfo: {
      name: "John Doe",
      title: "Senior Full-Stack Software Engineer",
      email: "john.doe@gmail.com",
      phone: "+1 (555) 019-2831",
      location: "San Francisco, CA",
      website: "johndoe.dev",
      linkedin: "https://www.linkedin.com/feed",
      github: "github.com/johndoe"
    },
    summary: "Senior Full-Stack Engineer with 6+ years of expertise in building low-latency distributed web applications, high-throughput backend systems, and beautiful, highly responsive client-side architectures. Proven track record of scaling engineering platforms, optimizing cloud costs, and mentoring multi-functional software engineering squads to launch next-generation products.",
    experience: [
      {
        id: "exp1",
        company: "Stripe",
        role: "Senior Software Engineer",
        location: "San Francisco, CA",
        startDate: "Jan 2023",
        endDate: "Present",
        current: true,
        description: "• Spearheaded the migration of core merchant checkout flows to React and Next.js, reducing average page load latency by 340ms and increasing check-out completion by 4.2%.\n• Designed and architected a high-throughput webhook processing pipeline using Node.js and AWS SQS, handling over 25M daily secure payment notifications.\n• Mentored a team of 4 software engineers and led agile planning cycles, ensuring a 98% on-time release rate of key payment features."
      },
      {
        id: "exp2",
        company: "Notion",
        role: "Software Engineer II",
        location: "San Francisco, CA",
        startDate: "Mar 2020",
        endDate: "Dec 2022",
        current: false,
        description: "• Engineered collaborative real-time editor mechanics using WebSockets and CRDTs, resulting in a 40% reduction in editor synchronization conflicts.\n• Integrated and optimized core third-party APIs (Slack, Figma, and Google Calendar) into Notion's external developer platform.\n• Refactored database indexes on PostgreSQL clusters, reducing expensive query response times by 45% and freeing up 18% CPU headroom."
      }
    ],
    education: [
      {
        id: "edu1",
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        location: "Berkeley, CA",
        startDate: "Sep 2015",
        endDate: "May 2019",
        current: false,
        gpa: "3.84/4.00",
        description: "Specialized in Distributed Systems and Software Engineering. Recipient of Regent's Scholars award."
      }
    ],
    projects: [
      {
        id: "proj1",
        name: "DevSphere Engine",
        role: "Creator & Lead Designer",
        link: "github.com/johndoe/devsphere",
        description: "• Built an open-source real-time developer terminal visualizer in React & TypeScript, garnering over 14,000 GitHub stars.\n• Implemented custom xterm.js visual plugins supporting high-frequency ANSI render frames with zero CPU stuttering."
      }
    ],
    skills: [
      {
        id: "sk1",
        category: "Languages & Core",
        skills: "TypeScript, JavaScript, Python, Go, SQL, HTML5, CSS3, Ruby"
      },
      {
        id: "sk2",
        category: "Frameworks & Libraries",
        skills: "React, Next.js, Express, Node.js, Tailwind CSS, GraphQL, Prisma, Django"
      },
      {
        id: "sk3",
        category: "Infrastructure & Tools",
        skills: "Docker, Kubernetes, AWS (SQS, Lambda, S3, RDS), PostgreSQL, Redis, WebSockets, Git"
      }
    ],
    certifications: [
      {
        id: "cert1",
        name: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        date: "May 2024"
      }
    ],
    awards: [
      {
        id: "aw1",
        title: "Engineering Excellence Award",
        issuer: "Stripe",
        date: "Dec 2024"
      }
    ],
    languages: [
      {
        id: "lang1",
        name: "English",
        level: "Native"
      },
      {
        id: "lang2",
        name: "Spanish",
        level: "Conversational"
      }
    ],
    interests: "Open source contributing, mechanical keyboards, hiking, high-performance coffee brewing"
  }
];
