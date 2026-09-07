export const profile = {
  name: 'Matt Domingo',
  fullName: 'Matthew Domingo',
  role: 'Software engineer & co-founder',
  location: 'Denver, Colorado',
  email: 'matthew.domingo2022@gmail.com',
  github: 'https://github.com/mattdomingo',
  linkedin: 'https://linkedin.com/in/matthewgdomingo',
  instagram: 'https://instagram.com/matt_domingo',
  education: 'B.S. Computer Science, University of Wisconsin–Madison',
  graduated: 'May 2026',
  minors: ['Economics', 'Mathematics', 'Statistics'],
  coursework: ['Algorithms', 'Combinatorics', 'Cryptography', 'Software Engineering', 'Econometrics', 'Applied Regression Analysis'],
}

export const experience = [
  {
    company: 'Visa', role: 'Software Engineer · Vital Signs', period: 'Jun 2026 — Present', location: 'Denver, CO',
    summary: 'Making critical payment infrastructure observable.',
    details: [
      'Deployed an MCP integration giving VisaNet-dependent teams authenticated, permission-controlled, read-only access to uptime, latency spikes, and predictive downtime data.',
      'Upgraded 20+ applications to Java 25 and tuned garbage collection and JVM/Spring Boot settings, improving production batch page processing and alerts performance by 10%.',
    ],
  },
  {
    company: 'DataAnnotation', role: 'AI Analyst', period: 'Jun 2025 — Present', location: 'Remote',
    summary: 'Evaluating what AI systems can actually do.',
    details: [
      'Build Rust, TypeScript, and C++ testbeds to evaluate LLM features against structured factuality, relevance, and reasoning criteria for RLHF and fine-tuning workflows.',
      'Compare models, MCP integrations, and prompt variants through A/B tests.',
    ],
  },
  {
    company: 'TruStage', role: 'Software Engineer Intern', period: 'Jun — Aug 2025', location: 'Madison, WI',
    summary: 'Cloud delivery, internal APIs, and LLM security.',
    details: [
      'Refactored Azure DevOps YAML pipelines with cross-functional teams to streamline delivery.',
      'Architected a C#/.NET microservice API for on-call engineers working with Azure Service Bus and Blob Storage.',
      'Built a Python sensitive-data detection tool to strengthen internal LLM security and compliance.',
    ],
  },
  {
    company: 'Pharus.ai', role: 'Software Engineer Intern', period: 'Jan — May 2025', location: 'Chicago, IL',
    summary: 'Turning business data into useful intelligence.',
    details: [
      'Delivered a customer-facing KPI chatbot using MCP and automated data preparation with Google Apps Script and Gemini.',
      'Designed and tested BigQuery SQL schemas and ETL pipelines for automated reporting.',
    ],
  },
  {
    company: 'Magnet-Schultz of America', role: 'Software Engineer Intern', period: 'May — Aug 2024', location: 'Chicago, IL',
    summary: 'The infrastructure underneath the software.',
    details: [
      'Secured 15 servers using host isolation, IOC hunts, artifact cleanup, and SPF/DKIM/DMARC email authentication.',
      'Provisioned AD DS and Exchange; managed GPOs, file access, WSUS patching, network diagrams, and switch-stack planning.',
    ],
  },
]

export const skillGroups = [
  { name: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C#', 'C++', 'C', 'SQL', 'Go', 'Rust', 'R', 'HTML/CSS'] },
  { name: 'Software & AI', skills: ['React', 'Next.js', 'Node.js', '.NET', 'Spring Boot', 'Three.js', 'MuJoCo', 'MCP', 'Gemini API', 'LLM evaluation', 'WebSockets'] },
  { name: 'Cloud & data', skills: ['AWS', 'Google Cloud', 'BigQuery', 'Azure DevOps', 'Cloudflare', 'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'Git', 'CI/CD'] },
  { name: 'Tools & practice', skills: ['Figma', 'Power Automate', 'Postman', 'JUnit', 'Agile Scrum'] },
]

export const leadership = ['President · Acacia Fraternity', 'Technical Recruiter · TruStage', 'COO · MadCloud', 'Eagle Scout']
