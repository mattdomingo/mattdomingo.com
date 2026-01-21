'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  technologies: string[]
  image: string
  githubUrl: string
  liveUrl?: string
  featured: boolean
  features: string[]
  challenges: string[]
  TODO: string[]
}

const projects: Project[] = [
  {
    id: 1,
    title: "mattdomingo.com",
    description: "minecraft-themed portfolio",
    longDescription: "A unique portfolio website built with a Minecraft aesthetic, featuring interactive elements, smooth animations, and a fully functional contact form. The site showcases my projects and skills in a creative, gaming-inspired interface.",
    technologies: ["Next.js", "TypeScript", "CSS", "React"],
    image: "/projects/mattdomingo-com.png",
    githubUrl: "https://github.com/mattdomingo/mattdomingo.com",
    featured: true,
    features: [
      "Minecraft-themed UI with custom textures and fonts",
      "Smooth page transitions with Framer Motion",
      "Responsive design optimized for all devices",
      "Contact form with EmailJS integration",
      "Interactive navigation with hover effects"
    ],
    challenges: [
      "Creating authentic Minecraft aesthetics in CSS",
      "Implementing smooth animations without performance issues",
      "Ensuring mobile responsiveness with complex layouts",
      "Integrating third-party email service securely"
    ],
    TODO: [
    ]
  },
  {
    id: 2,
    title: "ShipIt",
    description: "one-stop shop for the internship hunt",
    longDescription: "A comprehensive platform designed to streamline the internship application process. Features job tracking, application management, and automated workflow tools to help students efficiently manage their internship search.",
    technologies: ["React", "Node.js", "Python", "TypeScript"],
    image: "/projects/shipit.png",
    githubUrl: "https://github.com/mattdomingo/shipIt",
    featured: true,
    features: [
      "Job application tracking system",
      "Automated application workflow",
      "Company research tools",
      "Application deadline management",
      "Status tracking and analytics"
    ],
    challenges: [
      "Building scalable backend architecture",
      "Implementing real-time data synchronization",
      "Creating intuitive user workflows",
      "Handling large datasets efficiently"
    ],
    TODO: [
    ]
  },
  {
    id: 3,
    title: "Gravity Pong", 
    description: "classic pong game with a twist",
    longDescription: "A modern take on the classic Pong game, featuring gravity mechanics that add a new dimension to gameplay. Built in C++ with custom physics engine and smooth collision detection.",
    technologies: ["C++"],
    image: "/projects/gravity-pong.png",
    githubUrl: "https://github.com/mattdomingo/GravityPong",
    featured: true,
    features: [
      "Custom physics engine with gravity simulation",
      "Smooth collision detection and response",
      "Multiple difficulty levels",
      "Score tracking and high scores",
      "Responsive paddle controls"
    ],
    challenges: [
      "Implementing accurate physics calculations",
      "Optimizing real-time collision detection",
      "Creating smooth gameplay at 60 FPS",
      "Balancing game difficulty with gravity mechanics"
    ],
    TODO: [
    ]
  },
  {
    id: 4,
    title: "NewsTrader", 
    description: "news fetching and trading recommendations",
    longDescription: "An intelligent trading recommendation system that analyzes news sentiment and market data to provide actionable trading insights. Combines real-time news processing with financial data analysis.",
    technologies: ["C", "Python", "JavaScript", "CSS"],
    image: "/projects/newstrader.png",
    githubUrl: "https://github.com/mattdomingo/newstrader",
    featured: true,
    features: [
      "Real-time news sentiment analysis",
      "Market data integration",
      "Trading signal generation",
      "Risk assessment algorithms",
      "Portfolio performance tracking"
    ],
    challenges: [
      "Processing high-volume news feeds in real-time",
      "Implementing accurate sentiment analysis",
      "Handling market data API limitations",
      "Creating reliable trading signals"
    ],
    TODO: [
    ]
  },
  {
    id: 5,
    title: "Task Manager", 
    description: "self explanatory",
    longDescription: "A comprehensive task management application with modern UI/UX design. Features project organization, deadline tracking, team collaboration tools, and productivity analytics.",
    technologies: ["TypeScript", "Node.js", "CSS"],
    image: "/projects/task-manager.png",
    githubUrl: "https://github.com/mattdomingo/taskManager",
    featured: true,
    features: [
      "Project and task organization",
      "Deadline tracking and notifications",
      "Team collaboration tools",
      "Progress tracking and analytics",
      "Customizable workflows"
    ],
    challenges: [
      "Designing intuitive task management workflows",
      "Implementing real-time collaboration features",
      "Creating responsive and accessible UI",
      "Optimizing database queries for performance"
    ],
    TODO: [
    ]
  },
  {
    id: 6,
    title: "PomoTask", 
    description: "pomodoro timer with task management",
    longDescription: "A productivity application that combines the Pomodoro Technique with task management. Features customizable timers, task tracking, and productivity analytics to help users stay focused and productive.",
    technologies: ["TypeScript", "Node.js", "Docker", "CSS"],
    image: "/projects/pomotask.png",
    githubUrl: "https://github.com/mattdomingo/pomoTask",
    featured: true,
    features: [
      "Customizable Pomodoro timer",
      "Task integration and tracking",
      "Break reminders and notifications",
      "Productivity statistics and insights",
      "Focus session analytics"
    ],
    challenges: [
      "Creating accurate timer functionality",
      "Implementing background notifications",
      "Designing distraction-free interface",
      "Balancing feature richness with simplicity"
    ],
    TODO: [
    ]
  },
  {
    id: 7,
    title: "Sheets Project", 
    description: "data pipeline for google sheets integration",
    longDescription: "A robust data pipeline system for Google Sheets integration, enabling automated data processing, transformation, and synchronization. Built with scalability and reliability in mind.",
    technologies: ["SQL", "JSON", "YAML"],
    image: "/projects/sheets-project.png",
    githubUrl: "https://github.com/mattdomingo/sheetsProject",
    featured: true,
    features: [
      "Automated data synchronization",
      "Real-time data processing",
      "Error handling and retry mechanisms",
      "Data validation and transformation",
      "Scheduled batch processing"
    ],
    challenges: [
      "Handling Google Sheets API rate limits",
      "Implementing reliable data synchronization",
      "Creating efficient data transformation pipelines",
      "Ensuring data consistency across systems"
    ],
    TODO: [
    ]
  },
  {
    id: 8,
    title: "Label Automation", 
    description: "scan directory and identify sensitive files",
    longDescription: "An automated file classification system that scans directories and identifies sensitive files based on content analysis. Helps organizations maintain data security and compliance.",
    technologies: ["HTML", "Python"],
    image: "/projects/label-automation.png",
    githubUrl: "https://github.com/mattdomingo/label-automation-v2",
    featured: true,
    features: [
      "Automated file content analysis",
      "Sensitive data pattern recognition",
      "Bulk directory scanning",
      "Compliance reporting",
      "Custom classification rules"
    ],
    challenges: [
      "Implementing accurate content analysis",
      "Handling various file formats",
      "Optimizing scanning performance",
      "Creating flexible classification system"
    ],
    TODO: [
    ]
  },
  {
    id: 9,
    title: "TruWeaveTrader",
    description: "blazing-fast terminal trading app with sub-150ms latency",
    longDescription: "A high-performance terminal trading application for ultra-low latency financial trading. Features real-time WebSocket streaming, intelligent caching, and comprehensive risk management with sub-150ms quote fetching and sub-100ms trade execution.",
    technologies: ["Go", "WebSockets", "CI/CD"],
    image: "/projects/truweavetrader.png",
    githubUrl: "https://github.com/mattdomingo/TruWeaveTrader",
    featured: true,
    features: [
      "Sub-150ms quote fetching with intelligent caching",
      "Real-time WebSocket streaming for live market data",
      "One-command trading with comprehensive risk checks",
      "Built-in position sizing and loss limits",
      "Color-coded terminal interface with formatted displays"
    ],
    challenges: [
      "Achieving sub-150ms cold start performance",
      "Implementing real-time WebSocket streaming architecture",
      "Building comprehensive risk management system",
      "Optimizing Go performance for financial applications"
    ],
    TODO: [
      "Automatic execution of trades",
      "Options arbitrage",
      "Momentum-based strategies",
      "KPI Dashboard",
      "Backtesting",
      "ML-based trading",
    ]
  },
  {
    id: 10,
    title: "QuestGPT",
    description: "AI-powered text-based RPG game",
    longDescription: "A dynamic text-based RPG game powered by AI for content generation. Built with Spring Boot and React, featuring combat systems, shop mechanics, leveling progression, and enemy scaling. Players can choose builds and fight increasingly challenging enemies in an AI-driven adventure.",
    technologies: ["Java", "Spring Boot", "React", "MySQL", "Docker", "JavaScript"],
    image: "/projects/questgpt.png",
    githubUrl: "https://github.com/mattdomingo/QuestGPT",
    featured: true,
    features: [
      "AI-powered dynamic content generation",
      "Combat system with attack, dodge, rest, and run actions",
      "Shop system with items and upgrades",
      "Level progression with scaling enemies",
      "Multiple build types for character customization",
      "RESTful API for game state management"
    ],
    challenges: [
      "Integrating AI for dynamic story and content generation",
      "Managing complex game state across sessions",
      "Implementing real-time combat mechanics",
      "Balancing game difficulty with level scaling",
      "Coordinating backend and frontend state synchronization"
    ],
    TODO: [
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
    id: 11,
    title: "brookecarmichael.com",
    description: "portfolio website for journalism major",
    longDescription: "A professional portfolio website showcasing journalism work, writing samples, and multimedia projects. Built with modern web technologies to provide a clean, accessible platform for displaying articles, publications, and career achievements.",
    technologies: ["JavaScript", "TypeScript", "CSS"],
    image: "/projects/brookecarmichael.png",
    githubUrl: "https://brookecarmichael.com",
    liveUrl: "https://brookecarmichael.com",
    featured: true,
    features: [
      "Clean, professional design optimized for content display",
      "Responsive layout for all devices",
      "Portfolio showcase for journalism work",
      "Article and writing sample displays",
      "Professional biography and contact sections",
      "Optimized performance for fast loading"
    ],
    challenges: [
      "Designing content-focused layout for journalism portfolio",
      "Creating a interactive carousel for portfolio items",
      "Creating accessible and readable typography",
      "Implementing responsive design for various screen sizes",
      "Optimizing images and media for web performance"
    ],
    TODO: []
  },
]

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      const resolvedParams = await params
      const projectId = parseInt(resolvedParams.id)
      const foundProject = projects.find(p => p.id === projectId)
      
      if (foundProject) {
        setProject(foundProject)
      }
      setLoading(false)
    }
    
    loadProject()
  }, [params])

  if (loading) {
    return (
      <>
        <MinecraftNavbar />
        <PageTransition>
          <div className="project-detail-page page-with-navbar">
            <div className="project-detail-container">
              <div className="loading-message minecraft-text">Loading project...</div>
            </div>
          </div>
        </PageTransition>
      </>
    )
  }

  if (!project) {
    return (
      <>
        <MinecraftNavbar />
        <PageTransition>
          <div className="project-detail-page page-with-navbar">
            <div className="project-detail-container">
              <div className="error-message minecraft-text">
                Project not found
                <br />
                <button 
                  onClick={() => router.push('/projects')}
                  className="minecraft-button back-button"
                >
                  Back to Projects
                </button>
              </div>
            </div>
          </div>
        </PageTransition>
      </>
    )
  }

  return (
    <>
      <MinecraftNavbar />
      <PageTransition>
        <div className="project-detail-page page-with-navbar">
          <div className="project-detail-container">
            {/* Back Button */}
            <button 
              onClick={() => router.push('/projects')}
              className="minecraft-button back-button"
            >
              ← Back to Projects
            </button>

            {/* Project Header */}
            <div className="project-header">
              <div className="project-image-section">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="project-detail-image"
                />
              </div>
              
              <div className="project-title-section">
                <h1 className="project-detail-title minecraft-text">{project.title}</h1>
                <p className="project-detail-description minecraft-text">
                  {project.longDescription}
                </p>
                
                <div className="project-links-section">
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="minecraft-button project-link-btn"
                  >
                    {project.githubUrl.includes('github.com') ? 'View on GitHub' : 'View Live Site'}
                  </a>
                  {project.liveUrl && project.liveUrl !== project.githubUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="minecraft-button project-link-btn live-demo"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Technologies Section */}
            <div className="project-section">
              <h2 className="section-title minecraft-text">Technologies Used</h2>
              <div className="technologies-grid">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="tech-item minecraft-frame">
                    <span className="tech-name minecraft-text">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="project-section">
              <h2 className="section-title minecraft-text">Key Features</h2>
              <div className="features-list">
                {project.features.map((feature, index) => (
                  <div key={index} className="feature-item minecraft-frame">
                    <span className="feature-bullet minecraft-text">⚡</span>
                    <span className="feature-text minecraft-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges Section */}
            <div className="project-section">
              <h2 className="section-title minecraft-text">Challenges & Solutions</h2>
              <div className="challenges-list">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="challenge-item minecraft-frame">
                    <span className="challenge-bullet minecraft-text">🔧</span>
                    <span className="challenge-text minecraft-text">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* TODDO Section */}
            <div className="project-section">
              <h2 className="section-title minecraft-text">Coming Soon...</h2>
              <div className="TODO-list">
                {project.TODO.map((TODO, index) => (
                  <div key={index} className="feature-item minecraft-frame">
                    <span className="feature-bullet minecraft-text">⚡</span>
                    <span className="feature-text minecraft-text">{TODO}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  )
} 