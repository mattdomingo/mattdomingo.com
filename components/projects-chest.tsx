"use client"

import { useState } from "react"
import { X, ExternalLink, Github } from "lucide-react"
import MinecraftButton from "./minecraft-button"

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured online store with cart, checkout, and payment processing.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
    completionDate: "June 2024",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A Kanban-style task manager with drag-and-drop functionality.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["React", "TypeScript", "Firebase"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
    completionDate: "April 2024",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Real-time weather information with interactive maps and forecasts.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["JavaScript", "OpenWeather API", "Chart.js"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
    completionDate: "February 2024",
  },
  {
    id: 4,
    title: "Social Media Analytics",
    description: "Dashboard for tracking and analyzing social media performance metrics.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["Next.js", "Tailwind CSS", "GraphQL"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
    completionDate: "December 2023",
  },
  {
    id: 5,
    title: "Fitness Tracker",
    description: "Mobile-first application for tracking workouts and nutrition.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["React Native", "Redux", "Firebase"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
    completionDate: "October 2023",
  },
  {
    id: 6,
    title: "Portfolio Website",
    description: "Personal portfolio website with Minecraft-inspired design.",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
    completionDate: "July 2023",
  },
]

export default function ProjectsChest() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeTag, setActiveTag] = useState("All")

  const allTags = ["All", ...new Set(projects.flatMap((project) => project.tags))]

  const filteredProjects =
    activeTag === "All" ? projects : projects.filter((project) => project.tags.includes(activeTag))

  return (
    <div className="minecraft-chest">
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 border-2 border-gray-700 text-sm ${
              activeTag === tag
                ? "bg-[#FFD700] text-black"
                : "bg-gray-800 bg-opacity-70 text-gray-300 hover:bg-opacity-90"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="minecraft-project-block cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="bg-[#7D7D7D] border-4 border-t-[#A5A5A5] border-l-[#A5A5A5] border-r-[#555555] border-b-[#555555] overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <span className="minecraft-text text-white opacity-0 hover:opacity-100">View Project</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="minecraft-text text-xl mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-[#DC143C] text-white px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs bg-gray-600 text-white px-2 py-0.5">+{project.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="minecraft-modal bg-[#7D7D7D] border-8 border-t-[#A5A5A5] border-l-[#A5A5A5] border-r-[#555555] border-b-[#555555] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b-4 border-[#555555]">
              <h3 className="minecraft-text text-2xl">{selectedProject.title}</h3>
              <button onClick={() => setSelectedProject(null)} className="text-white hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <img
                src={selectedProject.image || "/placeholder.svg"}
                alt={selectedProject.title}
                className="w-full h-auto mb-4"
              />

              <p className="mb-4">{selectedProject.description}</p>

              <div className="mb-4">
                <h4 className="minecraft-text text-lg mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="text-sm bg-[#DC143C] text-white px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="minecraft-text text-lg mb-2">Completed</h4>
                <p>{selectedProject.completionDate}</p>
              </div>

              <div className="flex gap-4">
                <MinecraftButton href={selectedProject.demoUrl} variant="diamond" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </MinecraftButton>

                <MinecraftButton href={selectedProject.githubUrl} variant="wood" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Source Code
                </MinecraftButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
