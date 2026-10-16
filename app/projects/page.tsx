'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
  video?: string
  githubUrl: string
  liveUrl?: string
  featured: boolean
  highlighted?: boolean
}

const projects: Project[] = [
  {
    id: 10,
    title: "QuestGPT",
    description: "AI-powered text-based RPG game",
    technologies: ["Java", "Spring Boot", "React", "SQL", "MySQL"],
    image: "/projects/questgpt.png",
    githubUrl: "https://github.com/mattdomingo/QuestGPT",
    featured: true,
    highlighted: true
  },
  {
    id: 15,
    title: "mujoco-sandbox",
    description: "browser viewer for replaying AVP hand-tracking captures with MuJoCo physics",
    technologies: ["TypeScript", "Next.js", "Three.js", "MuJoCo"],
    image: "/projects/mujoco-sandbox.png",
    video: "/projects/mujoco-sandbox.webm",
    githubUrl: "https://github.com/mattdomingo/mujoco-sandbox",
    featured: true,
    highlighted: true
  },
  {
    id: 13,
    title: "capture-enrichment",
    description: "AI pipeline for annotating Apple Vision Pro capture sessions",
    technologies: ["Python", "Gemini", "FFmpeg", "AWS"],
    image: "/projects/capture-enrichment.png",
    githubUrl: "https://github.com/mattdomingo/capture-enrichment",
    featured: true,
    highlighted: true
  },
  {
    id: 16,
    title: "f1-predictor",
    description: "Formula 1 finishing-position predictor with sklearn models",
    technologies: ["Python", "scikit-learn", "Pandas"],
    image: "/projects/f1-predictor.png",
    githubUrl: "https://github.com/mattdomingo/f1-predictor",
    featured: true
  },
  {
    id: 14,
    title: "connex",
    description: "invite-only relationship graph explorer with Gmail-powered tie strength",
    technologies: ["TypeScript", "React", "Express", "SQLite"],
    image: "/projects/connex.png",
    githubUrl: "https://github.com/mattdomingo/connex",
    featured: true
  },
  {
    id: 12,
    title: "mingo-mail",
    description: "basic email agent used for teaching anthropicclaude builder club",
    technologies: ["Python", "Claude API"],
    image: "/projects/mingo-mail.png",
    githubUrl: "https://github.com/mattdomingo/mingo-mail",
    featured: true,
  },
  {
    id: 9,
    title: "TruWeaveTrader",
    description: "blazing-fast terminal trading app",
    technologies: ["Go", "WebSockets", "Alpaca API"],
    image: "/projects/truweavetrader.png",
    githubUrl: "https://github.com/mattdomingo/TruWeaveTrader",
    featured: true
  },
  {
    id: 1,
    title: "mattdomingo.com",
    description: "minecraft-themed portfolio",
    technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    image: "/projects/mattdomingo-com.png",
    githubUrl: "https://github.com/mattdomingo/mattdomingo.com", // Replace with your actual repo
    //liveUrl: "https://mattdomingo.com",
    featured: true
  },
  {
    id: 2,
    title: "ShipIt",
    description: "one-stop shop for the internship hunt",
    technologies: ["Python", "FastAPI", "React Native", "Expo"],
    image: "/projects/shipit.png",
    githubUrl: "https://github.com/mattdomingo/shipIt",
    featured: true
  },
  {
    id: 3,
    title: "Gravity Pong", 
    description: "classic pong game with a twist",
    technologies: ["C++", "SDL3", "CMake"],
    image: "/projects/gravity-pong.png",
    githubUrl: "https://github.com/mattdomingo/GravityPong",
    featured: true
  },
  {
    id: 4,
    title: "NewsTrader", 
    description: "news fetching and trading recommendations",
    technologies: ["C", "Python", "React", "Hugging Face"],
    image: "/projects/newstrader.png",
    githubUrl: "https://github.com/mattdomingo/newstrader",
    featured: true
  },
  {
    id: 5,
    title: "Task Manager", 
    description: "self explanatory",
    technologies: ["TypeScript", "React", "Vite"],
    image: "/projects/task-manager.png",
    githubUrl: "https://github.com/mattdomingo/taskManager",
    featured: true
  },
  {
    id: 6,
    title: "PomoTask", 
    description: "pomodoro timer with task management",
    technologies: ["TypeScript", "React", "Vite", "Docker"],
    image: "/projects/pomotask.png",
    githubUrl: "https://github.com/mattdomingo/pomoTask",
    featured: true
  },
  {
    id: 7,
    title: "Sheets Project", 
    description: "data pipeline for google sheets integration",
    technologies: ["SQL", "BigQuery", "Google Cloud Scheduler"],
    image: "/projects/sheets-project.png",
    githubUrl: "https://github.com/mattdomingo/sheetsProject",
    featured: true
  },
  {
    id: 8,
    title: "Label Automation",
    description: "scan directory and identify sensitive files",
    technologies: ["Python", "Tesseract OCR", "Tkinter"],
    image: "/projects/label-automation.png",
    githubUrl: "https://github.com/mattdomingo/label-automation-v2", // Replace with actual repo
    featured: true
  },
]

const allTechnologies = [
  "All", "React", "Next.js", "TypeScript", "Python", "FastAPI", "Java",
  "Spring Boot", "Go", "C++", "C", "SQL", "Docker", "AWS", "scikit-learn",
]

export default function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const router = useRouter()
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())

  const filteredProjects = selectedFilter === "All"
    ? projects
    : projects.filter(project =>
        project.technologies.some(tech => tech === selectedFilter)
      )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.3 }
    )
    videoRefs.current.forEach((video) => observer.observe(video))
    return () => observer.disconnect()
  }, [filteredProjects])

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  return (
    <>
      <MinecraftNavbar />
      <PageTransition>
        <div className="builds-gallery-page page-with-navbar">
        <div className="builds-gallery-container">
          <h1 className="builds-gallery-title minecraft-text">BUILDS GALLERY</h1>
          
          {/* Filter Buttons */}
          <div className="filter-buttons-container">
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedFilter(tech)}
                className={`filter-button minecraft-text ${
                  selectedFilter === tech ? 'active' : ''
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className={`project-card minecraft-frame clickable-card ${project.highlighted ? 'highlighted-project' : ''}`}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-image-container">
                  {project.video ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current.set(project.id, el)
                        else videoRefs.current.delete(project.id)
                      }}
                      className="project-image"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={project.image}
                    >
                      <source src={project.video} type="video/webm" />
                      <source src={project.video.replace('.webm', '.mp4')} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-image"
                    />
                  )}
                </div>
                
                <div className="project-info">
                  <h3 className="project-title minecraft-text">{project.title}</h3>
                  <p className="project-description minecraft-text">{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag minecraft-text">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="minecraft-button project-link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.githubUrl.includes('github.com') ? 'GitHub' : 'View Site'}
                    </a>
                    {project.liveUrl && project.liveUrl !== project.githubUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="minecraft-button project-link-btn live-demo"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </PageTransition>
    </>
  )
}
