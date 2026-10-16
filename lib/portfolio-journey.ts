export type JourneyItem = { date: string; period: string; title: string; organization?: string; content: string };

// Dates and career details come from the supplied résumé; early milestones were supplied separately.
export const JOURNEY: JourneyItem[] = [
  { date: "2014-10", period: "October 2014", title: "First lines of Python", organization: "Northwestern University · Center for Talent Development", content: "Took my first Python course through Northwestern’s Center for Talent Development program. The beginning of a long-running curiosity about what I could build with code." },
  { date: "2018-05", period: "May 2018", title: "A winning experiment", organization: "Science fair", content: "Won the science fair with an experiment demonstrating Faraday’s laws of electromagnetic induction." },
  { date: "2018-06", period: "June 2018", title: "Middle school, complete", content: "Graduated middle school." },
  { date: "2022-05", period: "May 2022", title: "High school, complete", content: "Graduated high school." },
  { date: "2024-05", period: "May — August 2024", title: "Software Engineer Intern", organization: "Magnet-Schultz of America · Chicago", content: "Secured 15 servers through host isolation, IOC hunts, and email authentication. Worked across Active Directory, Exchange, group policies, patching, network diagrams, and switch-stack planning." },
  { date: "2025-01", period: "January — May 2025", title: "Software Engineer Intern", organization: "Pharus.ai · Chicago", content: "Delivered a customer-facing KPI chatbot using MCP, Google Apps Script, and Gemini. Designed BigQuery schemas and ETL pipelines to automate reporting across business services." },
  { date: "2025-06", period: "June — August 2025", title: "Software Engineer Intern", organization: "TruStage · Madison", content: "Refactored Azure DevOps delivery pipelines, architected a C#/.NET API for Azure Service Bus and Blob Storage, and built a Python sensitive-data detection tool for internal LLM security." },
  { date: "2025-06", period: "June 2025 — Present", title: "AI Analyst", organization: "DataAnnotation · Remote", content: "Build Rust, TypeScript, and C++ testbeds to evaluate LLM factuality, relevance, and reasoning. Compare models, MCP integrations, and prompts through A/B tests for RLHF and fine-tuning workflows." },
  { date: "2026-01", period: "January — May 2026", title: "Lead Developer", organization: "Holos · Industry capstone", content: "Led a five-person team building a synchronized Three.js/MuJoCo viewer, Python/Gemini capture enrichment, and an inverse kinematics solver for Apple Vision Pro tracking. Delivered features adopted by Holos and showcased to Samsung and NVIDIA." },
  { date: "2026-05", period: "May 2026", title: "On, Wisconsin", organization: "University of Wisconsin–Madison", content: "Graduated with a B.S. in Computer Science and minors in Economics, Mathematics, and Statistics. Studied algorithms, combinatorics, cryptography, software engineering, econometrics, and applied regression analysis." },
  { date: "2026-06", period: "June 2026 — Present", title: "Software Engineer · Vital Signs", organization: "Visa · Denver", content: "Built authenticated, read-only MCP tools for VisaNet uptime, latency, and predictive reliability data. Upgraded 20+ applications to Java 25 and tuned JVM/Spring Boot settings for a 10% production performance improvement in batch page processing and alerts." },
  { date: "2026-06", period: "June 2026 — Present", title: "Co-founder & CTO", organization: "openfloor", content: "Building human-demonstration infrastructure for physical AI: synchronized Swift/ARKit capture with resumable uploads, GPU hand reconstruction with MediaPipe, SAM2, and HaMeR/MANO, and a ManiSkill evaluator comparing video, spatial, and annotated demonstrations." },
];

export const TOOLKIT = [
  { title: "Languages", content: "Python, TypeScript / JavaScript, Java, C#, C++, SQL, Go, Rust" },
  { title: "Frameworks & AI", content: "React, Next.js, Node.js, Three.js, MuJoCo, .NET, Spring Boot, MCP, Gemini API" },
  { title: "Cloud & data", content: "AWS, GCP / BigQuery, Azure DevOps, Cloudflare, PostgreSQL, Docker, Kubernetes, Git, CI/CD" },
  { title: "Beyond the code", content: "AWS Certified Cloud Practitioner · President, Acacia Fraternity · Technical Recruiter, TruStage · COO, MadCloud · Eagle Scout" },
];
