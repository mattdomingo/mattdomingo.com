'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
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
    technologies: ["Java", "Spring Boot", "React", "MySQL", "Docker", "JavaScript"],
    image: "/projects/questgpt.png",
    githubUrl: "https://github.com/mattdomingo/QuestGPT",
    featured: true,
    highlighted: true
  },
  {
    id: 11,
    title: "brookecarmichael.com",
    description: "portfolio website for journalism major",
    technologies: ["JavaScript", "TypeScript", "CSS"],
    image: "/projects/brookecarmichael.png",
    githubUrl: "https://brookecarmichael.com",
    liveUrl: "https://brookecarmichael.com",
    featured: true
  },
  {
    id: 9,
    title: "TruWeaveTrader",
    description: "blazing-fast terminal trading app",
    technologies: ["Go", "WebSockets", "CI/CD"],
    image: "/projects/truweavetrader.png",
    githubUrl: "https://github.com/mattdomingo/TruWeaveTrader",
    featured: true
  },
  {
    id: 1,
    title: "mattdomingo.com",
    description: "minecraft-themed portfolio",
    technologies: ["Next.js", "TypeScript", "CSS", "React"],
    image: "/projects/mattdomingo-com.png",
    githubUrl: "https://github.com/mattdomingo/mattdomingo.com", // Replace with your actual repo
    //liveUrl: "https://mattdomingo.com",
    featured: true
  },
  {
    id: 2,
    title: "ShipIt",
    description: "one-stop shop for the internship hunt",
    technologies: ["React", "Node.js", "Python", "TypeScript"],
    image: "/projects/shipit.png",
    githubUrl: "https://github.com/mattdomingo/taskManager",
    featured: true
  },
  {
    id: 3,
    title: "Gravity Pong", 
    description: "classic pong game with a twist",
    technologies: ["C++"],
    image: "/projects/gravity-pong.png",
    githubUrl: "https://github.com/mattdomingo/GravityPong",
    featured: true
  },
  {
    id: 4,
    title: "NewsTrader", 
    description: "news fetching and trading recommendations",
    technologies: ["C", "Python", "JavaScript", "CSS"],
    image: "/projects/newstrader.png",
    githubUrl: "https://github.com/mattdomingo/newstrader",
    featured: true
  },
  {
    id: 5,
    title: "Task Manager", 
    description: "self explanatory",
    technologies: ["TypeScript", "Node.js", "CSS"],
    image: "/projects/task-manager.png",
    githubUrl: "https://github.com/mattdomingo/taskManager",
    featured: true
  },
  {
    id: 6,
    title: "PomoTask", 
    description: "pomodoro timer with task management",
    technologies: ["TypeScript", "Node.js", "Docker", "CSS"],
    image: "/projects/pomotask.png",
    githubUrl: "https://github.com/mattdomingo/pomoTask",
    featured: true
  },
  {
    id: 7,
    title: "Sheets Project", 
    description: "data pipeline for google sheets integration",
    technologies: ["SQL", "JSON", "YAML"],
    image: "/projects/sheets-project.png",
    githubUrl: "https://github.com/mattdomingo/sheetsProject",
    featured: true
  },
  {
    id: 8,
    title: "Label Automation", 
    description: "scan directory and identify sensitive files",
    technologies: ["HTML", "Python"],
    image: "/projects/label-automation.png",
    githubUrl: "https://github.com/mattdomingo/label-automation-v2", // Replace with actual repo
    featured: true
  }
]

const allTechnologies = [
  "All", "React", "Next.js", "TypeScript", "Node.js", "Python", "JavaScript", 
  "CSS", "C++", "C", "Docker", "SQL", "JSON", "YAML", "HTML", "Go", "WebSockets", "CI/CD",
  "Java", "Spring Boot", "MySQL"
]

export default function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const router = useRouter()

  const filteredProjects = selectedFilter === "All" 
    ? projects 
    : projects.filter(project => 
        project.technologies.some(tech => tech === selectedFilter)
      )

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
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="project-image"
                  />
                </div>
                
                <div className="project-info">
                  <h3 className="project-title minecraft-text">{project.title}</h3>
                  <p className="project-description minecraft-text">{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="tech-tag minecraft-text">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="tech-tag minecraft-text extra-count">
                        +{project.technologies.length - 3}
                      </span>
                    )}
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
