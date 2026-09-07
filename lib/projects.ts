export interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  technologies: string[]
  image: string
  video?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  features: string[]
  challenges: string[]
  TODO: string[]
}

export const projects: Project[] = [
  {
    "id": 17,
    "title": "Openfloor",
    "description": "A shared workspace for people and AI coding agents",
    "longDescription": "I co-founded Openfloor and built a multiplayer workspace for teams working with AI coding agents on a shared codebase. Teammates can see prompts as they are typed, run agents in parallel, and follow work in real time. I own both the engineering and the product work: roadmap, co-founder coordination, beta rollout, and go-to-market.",
    "technologies": [
      "AI agents",
      "MCP",
      "Real-time collaboration"
    ],
    "image": "",
    "liveUrl": "https://opnflr.com",
    "featured": true,
    "features": [
      "Automatic task routing and shared agent context",
      "Merge-conflict resolution with checks and human input when needed",
      "A shared review workflow for parallel changes",
      "Private beta with 20 users and one paying customer building small microservices"
    ],
    "challenges": [
      "Coordinating parallel changes in a shared codebase",
      "Making agent work and teammate intent visible in real time",
      "Preserving human review when conflicts are ambiguous"
    ],
    "TODO": []
  },
  {
    "id": 10,
    "title": "QuestGPT",
    "description": "AI-powered text-based RPG game",
    "longDescription": "A dynamic text-based RPG game powered by AI for content generation. Built with Spring Boot and React, featuring combat systems, shop mechanics, leveling progression, and enemy scaling. Players can choose builds and fight increasingly challenging enemies in an AI-driven adventure.",
    "technologies": [
      "Java",
      "Spring Boot",
      "React",
      "SQL",
      "MySQL"
    ],
    "image": "/projects/questgpt.png",
    "githubUrl": "https://github.com/mattdomingo/QuestGPT",
    "featured": true,
    "features": [
      "AI-powered dynamic content generation",
      "Combat system with attack, dodge, rest, and run actions",
      "Shop system with items and upgrades",
      "Level progression with scaling enemies",
      "Multiple build types for character customization",
      "RESTful API for game state management"
    ],
    "challenges": [
      "Integrating AI for dynamic story and content generation",
      "Managing complex game state across sessions",
      "Implementing real-time combat mechanics",
      "Balancing game difficulty with level scaling",
      "Coordinating backend and frontend state synchronization"
    ],
    "TODO": [
      "Scaling for dodge heal and rest stamina based on player level",
      "Additional enemy types with unique abilities",
      "More shop item varieties",
      "Achievement system",
      "Leaderboards",
      "Multiplayer battles",
      "Quest system with side objectives"
    ]
  },
  {
    "id": 15,
    "title": "mujoco-sandbox",
    "description": "browser viewer for replaying AVP hand-tracking captures with MuJoCo physics",
    "longDescription": "Browser-based viewer for replaying Holos .capture folders with MuJoCo WASM physics and Three.js rendering. Drives a humanoid model from Apple Vision Pro hand-tracking data with synchronized video playback, inverse kinematics overlays, and live pressure HUDs.",
    "technologies": [
      "TypeScript",
      "Next.js",
      "Three.js",
      "MuJoCo"
    ],
    "image": "/projects/mujoco-sandbox.png",
    "video": "/projects/mujoco-sandbox.webm",
    "githubUrl": "https://github.com/mattdomingo/mujoco-sandbox",
    "featured": true,
    "features": [
      "MuJoCo WASM physics with raw mocap and physics-resolved rendering modes",
      "Synchronized video playback aligned frame-accurately to capture timeline",
      "Humanoid inverse kinematics overlay driven by hand and device pose data",
      "Ball pressure and inter-hand pressure HUDs updated in real time",
      "Folder drag-and-drop with play, pause, and timeline scrubbing controls",
      "Playwright end-to-end tests with a dedicated MuJoCo WASM integration test harness"
    ],
    "challenges": [
      "Initializing MuJoCo WASM in the browser with SharedArrayBuffer (COOP/COEP headers required)",
      "Aligning hand-tracking CSV timestamps with video playback at frame-accurate precision",
      "Graceful fallback to raw capture rendering when MuJoCo fails to initialize",
      "Building a Playwright test harness for physics simulation in a headless browser"
    ],
    "TODO": [
      "Support for full-body pose reconstruction beyond arms and torso",
      "WebXR playback mode for immersive capture review"
    ]
  },
  {
    "id": 13,
    "title": "capture-enrichment",
    "description": "AI pipeline for annotating Apple Vision Pro capture sessions",
    "longDescription": "Ingests Apple Vision Pro .capture packages and produces structured, timestamped activity annotations. Uses a two-pass Gemini pipeline to annotate events and segment them into semantic chapters, with JPEG thumbnail frames extracted at each event's timecode via FFmpeg.",
    "technologies": [
      "Python",
      "Gemini",
      "FFmpeg",
      "AWS"
    ],
    "image": "/projects/capture-enrichment.png",
    "githubUrl": "https://github.com/mattdomingo/capture-enrichment",
    "featured": true,
    "features": [
      "Two-pass Gemini pipeline: parallel chunk annotation then semantic chapter segmentation",
      "Structured telemetry context: head movement, pinch gestures, tracked objects, transcript",
      "Overlapping chunk processing with cross-boundary event deduplication",
      "JPEG thumbnail extraction at each event timecode via FFmpeg",
      "Lightweight static viewer for browsing sessions and thumbnails side-by-side"
    ],
    "challenges": [
      "Deduplicating events at chunk overlap boundaries without discarding real events",
      "Extracting meaningful telemetry signals (pinch gestures, head movement) from raw CSV data",
      "Managing Gemini file upload lifecycle and retrying on rate limit responses",
      "Aligning telemetry timestamps with video chunks across multiple data sources"
    ],
    "TODO": [
      "AWS Lambda container deployment for scalable cloud processing",
      "AWS Step Functions for parallel chunk annotation on long sessions",
      "Async concurrent Pass 1 chunk processing via asyncio",
      "Sub-second thumbnail precision using millisecond-level event timestamps"
    ]
  },
  {
    "id": 16,
    "title": "f1-predictor",
    "description": "Formula 1 finishing-position predictor with sklearn models",
    "longDescription": "A Formula 1 finishing-position prediction project that trains and compares regression models from historical race CSV data. It builds features from grid position, qualifying, pit stops, and season context, then writes metrics, plots, and interpretation artifacts from an end-to-end Python pipeline.",
    "technologies": [
      "Python",
      "scikit-learn",
      "Pandas"
    ],
    "image": "/projects/f1-predictor.png",
    "githubUrl": "https://github.com/mattdomingo/f1-predictor",
    "featured": true,
    "features": [
      "End-to-end training entrypoint for data preparation, model fitting, evaluation, and output generation",
      "Feature engineering across race results, qualifying, pit stops, and season context",
      "Regression model comparison using linear, Lasso, gradient boosting, and related sklearn pipelines",
      "Generated model metrics written to CSV for repeatable comparison",
      "Post-hoc plots and interpretation artifacts for model analysis"
    ],
    "challenges": [
      "Combining multiple Formula 1 data tables into a consistent training dataset",
      "Representing race context without leaking future result information into model features",
      "Comparing different regression approaches on a noisy, position-based target",
      "Producing outputs that make model performance and feature behavior easy to inspect"
    ],
    "TODO": [
      "Add live race prediction inputs",
      "Expand model comparison with additional ensemble methods",
      "Add automated data refresh for newer seasons",
      "Publish an interactive results dashboard"
    ]
  },
  {
    "id": 14,
    "title": "connex",
    "description": "invite-only relationship graph explorer with Gmail-powered tie strength",
    "longDescription": "An invite-only relationship graph app for mapping real-world connections. Full-stack TypeScript MVP with degree-based access gating, Gmail sync for tie-strength scoring, and interactive force-directed graph visualization using d3-force.",
    "technologies": [
      "TypeScript",
      "React",
      "Express",
      "SQLite"
    ],
    "image": "/projects/connex.png",
    "githubUrl": "https://github.com/mattdomingo/connex",
    "featured": true,
    "features": [
      "Interactive force-directed graph visualization with d3-force",
      "Degree-based access gating: free tier sees up to 2nd-degree connections",
      "Gmail sync for computing tie-strength scores from email metadata only",
      "Invite-only registration with code expiration and per-code usage limits",
      "Google OAuth for both authentication and Gmail integration",
      "AES-256-GCM encrypted OAuth token storage at rest"
    ],
    "challenges": [
      "Separating entitlement policy from BFS traversal to allow clean monetization hooks",
      "Encrypting OAuth tokens at rest without exposing keys in logs or API responses",
      "Handling pending vs accepted connections consistently across graph traversal and shortest-path",
      "Designing tie-strength scoring that rewards bidirectional communication over one-sided threads"
    ],
    "TODO": [
      "Wire degree gating to a real subscription and payment system",
      "Automated fuzzy email-to-person matching on new user signup",
      "Streaming graph updates as Gmail sync progresses in real time"
    ]
  },
  {
    "id": 12,
    "title": "mingo-mail",
    "description": "basic email agent used for teaching anthropicclaude builder club",
    "longDescription": "A basic email agent used for teaching anthropic claude builder club. Categorizes, summarizes, and creates drafts of emails based on urgency",
    "technologies": [
      "Python",
      "Claude API"
    ],
    "image": "/projects/mingo-mail.png",
    "githubUrl": "https://github.com/mattdomingo/mingo-mail",
    "featured": true,
    "features": [
      "Categorizes emails based on topic",
      "Summarizes emails",
      "Creates drafts of emails based on urgency",
      "Hardened security using regex, input validation, and context window limiting"
    ],
    "challenges": [
      "Making it simple enough for beginners to understand",
      "Preventing prompt injection",
      "Creating diagrams to help explain the code"
    ],
    "TODO": [
      "Potentially make it a widget"
    ]
  },
  {
    "id": 9,
    "title": "TruWeaveTrader",
    "description": "blazing-fast terminal trading app with sub-150ms latency",
    "longDescription": "A high-performance terminal trading application for ultra-low latency financial trading. Features real-time WebSocket streaming, intelligent caching, and comprehensive risk management with sub-150ms quote fetching and sub-100ms trade execution.",
    "technologies": [
      "Go",
      "WebSockets",
      "Alpaca API"
    ],
    "image": "/projects/truweavetrader.png",
    "githubUrl": "https://github.com/mattdomingo/TruWeaveTrader",
    "featured": true,
    "features": [
      "Sub-150ms quote fetching with intelligent caching",
      "Real-time WebSocket streaming for live market data",
      "One-command trading with comprehensive risk checks",
      "Built-in position sizing and loss limits",
      "Color-coded terminal interface with formatted displays"
    ],
    "challenges": [
      "Achieving sub-150ms cold start performance",
      "Implementing real-time WebSocket streaming architecture",
      "Building comprehensive risk management system",
      "Optimizing Go performance for financial applications"
    ],
    "TODO": [
      "Automatic execution of trades",
      "Options arbitrage",
      "Momentum-based strategies",
      "KPI Dashboard",
      "Backtesting",
      "ML-based trading"
    ]
  },
  {
    "id": 1,
    "title": "mattdomingo.com",
    "description": "A portfolio, from Minecraft to a spatial web experience",
    "longDescription": "Originally built as a Minecraft-themed portfolio with custom textures, an interactive skills inventory, project pages, and an EmailJS contact form. The current redesign explores an immersive 3D experience with cinematic dark and architectural light themes, while preserving the project archive.",
    "technologies": [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS"
    ],
    "image": "/projects/mattdomingo-com.png",
    "githubUrl": "https://github.com/mattdomingo/mattdomingo.com",
    "featured": true,
    "features": [
      "Minecraft-themed UI with custom textures and fonts",
      "Smooth page transitions with Framer Motion",
      "Responsive design optimized for all devices",
      "Contact form with EmailJS integration",
      "Interactive navigation with hover effects"
    ],
    "challenges": [
      "Creating authentic Minecraft aesthetics in CSS",
      "Implementing smooth animations without performance issues",
      "Ensuring mobile responsiveness with complex layouts",
      "Integrating third-party email service securely"
    ],
    "TODO": []
  },
  {
    "id": 2,
    "title": "ShipIt",
    "description": "one-stop shop for the internship hunt",
    "longDescription": "A comprehensive platform designed to streamline the internship application process. Features job tracking, application management, and automated workflow tools to help students efficiently manage their internship search.",
    "technologies": [
      "Python",
      "FastAPI",
      "React Native",
      "Expo"
    ],
    "image": "/projects/shipit.png",
    "githubUrl": "https://github.com/mattdomingo/shipIt",
    "featured": true,
    "features": [
      "Job application tracking system",
      "Automated application workflow",
      "Company research tools",
      "Application deadline management",
      "Status tracking and analytics"
    ],
    "challenges": [
      "Building scalable backend architecture",
      "Implementing real-time data synchronization",
      "Creating intuitive user workflows",
      "Handling large datasets efficiently"
    ],
    "TODO": []
  },
  {
    "id": 3,
    "title": "Gravity Pong",
    "description": "classic pong game with a twist",
    "longDescription": "A modern take on the classic Pong game, featuring gravity mechanics that add a new dimension to gameplay. Built in C++ with custom physics engine and smooth collision detection.",
    "technologies": [
      "C++",
      "SDL3",
      "CMake"
    ],
    "image": "/projects/gravity-pong.png",
    "githubUrl": "https://github.com/mattdomingo/GravityPong",
    "featured": true,
    "features": [
      "Custom physics engine with gravity simulation",
      "Smooth collision detection and response",
      "Multiple difficulty levels",
      "Score tracking and high scores",
      "Responsive paddle controls"
    ],
    "challenges": [
      "Implementing accurate physics calculations",
      "Optimizing real-time collision detection",
      "Creating smooth gameplay at 60 FPS",
      "Balancing game difficulty with gravity mechanics"
    ],
    "TODO": []
  },
  {
    "id": 4,
    "title": "NewsTrader",
    "description": "news fetching and trading recommendations",
    "longDescription": "An intelligent trading recommendation system that analyzes news sentiment and market data to provide actionable trading insights. Combines real-time news processing with financial data analysis.",
    "technologies": [
      "C",
      "Python",
      "React",
      "Hugging Face"
    ],
    "image": "/projects/newstrader.png",
    "githubUrl": "https://github.com/mattdomingo/newstrader",
    "featured": true,
    "features": [
      "Real-time news sentiment analysis",
      "Market data integration",
      "Trading signal generation",
      "Risk assessment algorithms",
      "Portfolio performance tracking"
    ],
    "challenges": [
      "Processing high-volume news feeds in real-time",
      "Implementing accurate sentiment analysis",
      "Handling market data API limitations",
      "Creating reliable trading signals"
    ],
    "TODO": []
  },
  {
    "id": 5,
    "title": "Task Manager",
    "description": "self explanatory",
    "longDescription": "A comprehensive task management application with modern UI/UX design. Features project organization, deadline tracking, team collaboration tools, and productivity analytics.",
    "technologies": [
      "TypeScript",
      "React",
      "Vite"
    ],
    "image": "/projects/task-manager.png",
    "githubUrl": "https://github.com/mattdomingo/taskManager",
    "featured": true,
    "features": [
      "Project and task organization",
      "Deadline tracking and notifications",
      "Team collaboration tools",
      "Progress tracking and analytics",
      "Customizable workflows"
    ],
    "challenges": [
      "Designing intuitive task management workflows",
      "Implementing real-time collaboration features",
      "Creating responsive and accessible UI",
      "Optimizing database queries for performance"
    ],
    "TODO": []
  },
  {
    "id": 6,
    "title": "PomoTask",
    "description": "pomodoro timer with task management",
    "longDescription": "A productivity application that combines the Pomodoro Technique with task management. Features customizable timers, task tracking, and productivity analytics to help users stay focused and productive.",
    "technologies": [
      "TypeScript",
      "React",
      "Vite",
      "Docker"
    ],
    "image": "/projects/pomotask.png",
    "githubUrl": "https://github.com/mattdomingo/pomoTask",
    "featured": true,
    "features": [
      "Customizable Pomodoro timer",
      "Task integration and tracking",
      "Break reminders and notifications",
      "Productivity statistics and insights",
      "Focus session analytics"
    ],
    "challenges": [
      "Creating accurate timer functionality",
      "Implementing background notifications",
      "Designing distraction-free interface",
      "Balancing feature richness with simplicity"
    ],
    "TODO": []
  },
  {
    "id": 7,
    "title": "Sheets Project",
    "description": "data pipeline for google sheets integration",
    "longDescription": "A robust data pipeline system for Google Sheets integration, enabling automated data processing, transformation, and synchronization. Built with scalability and reliability in mind.",
    "technologies": [
      "SQL",
      "BigQuery",
      "Google Cloud Scheduler"
    ],
    "image": "/projects/sheets-project.png",
    "githubUrl": "https://github.com/mattdomingo/sheetsProject",
    "featured": true,
    "features": [
      "Automated data synchronization",
      "Real-time data processing",
      "Error handling and retry mechanisms",
      "Data validation and transformation",
      "Scheduled batch processing"
    ],
    "challenges": [
      "Handling Google Sheets API rate limits",
      "Implementing reliable data synchronization",
      "Creating efficient data transformation pipelines",
      "Ensuring data consistency across systems"
    ],
    "TODO": []
  },
  {
    "id": 8,
    "title": "Label Automation",
    "description": "scan directory and identify sensitive files",
    "longDescription": "An automated file classification system that scans directories and identifies sensitive files based on content analysis. Helps organizations maintain data security and compliance.",
    "technologies": [
      "Python",
      "Tesseract OCR",
      "Tkinter"
    ],
    "image": "/projects/label-automation.png",
    "githubUrl": "https://github.com/mattdomingo/label-automation-v2",
    "featured": true,
    "features": [
      "Automated file content analysis",
      "Sensitive data pattern recognition",
      "Bulk directory scanning",
      "Compliance reporting",
      "Custom classification rules"
    ],
    "challenges": [
      "Implementing accurate content analysis",
      "Handling various file formats",
      "Optimizing scanning performance",
      "Creating flexible classification system"
    ],
    "TODO": []
  },
  {
    "id": 18,
    "title": "PerfectCandidate",
    "description": "A full-stack résumé optimization workflow",
    "longDescription": "A FastAPI and Next.js product for PDF extraction, similarity scoring, and inline rewrite suggestions. A PostgreSQL and MinIO architecture supports storage, presigned uploads, and service health checks.",
    "technologies": [
      "Python",
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "Docker"
    ],
    "image": "",
    "featured": false,
    "features": [
      "PDF extraction and inline rewrite suggestions",
      "spaCy and PyMuPDF for entity extraction and coverage scoring",
      "Docker Compose services with logs, tracing, and health checks"
    ],
    "challenges": [
      "Connecting document extraction, NLP scoring, and an editing workflow"
    ],
    "TODO": []
  }
]

export function getProject(id: string) {
  return projects.find(project => String(project.id) === id)
}
