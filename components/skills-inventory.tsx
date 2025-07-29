"use client"

import { useState } from "react"

const skills = [
  { name: "Python", level: 90, type: "language", icon: "🐍" },
  { name: "Java", level: 85, type: "language", icon: "☕" },
  { name: "Go", level: 82, type: "language", icon: "🚀" },
  { name: "C", level: 80, type: "language", icon: "⚙️" },
  { name: "TypeScript", level: 88, type: "language", icon: "🔷" },
  { name: "JavaScript", level: 90, type: "language", icon: "🟨" },
  { name: "C#", level: 82, type: "language", icon: "🔹" },
  { name: "C++", level: 78, type: "language", icon: "🔧" },
  { name: "SQL", level: 85, type: "language", icon: "🗃️" },
  { name: "R", level: 75, type: "language", icon: "📊" },
  { name: "HTML/CSS", level: 92, type: "language", icon: "🌐" },
  { name: "AWS", level: 80, type: "tool", icon: "☁️" },
  { name: "Google Cloud", level: 75, type: "tool", icon: "🌤️" },
  { name: "Azure DevOps", level: 70, type: "tool", icon: "🔄" },
  { name: "CI/CD Pipeline", level: 78, type: "tool", icon: "🔧" },
  { name: "Power Automate", level: 68, type: "tool", icon: "⚡" },
  { name: "Figma", level: 78, type: "tool", icon: "🎨" },
]

export default function SkillsInventory() {
  const [filter, setFilter] = useState("all")

  const filteredSkills = filter === "all" ? skills : skills.filter((skill) => skill.type === filter)

  return (
    <div className="skills-inventory-container">
      <h3 className="skills-inventory-title">SKILLS INVENTORY</h3>

      <div className="skills-filter-container">
        {["all", "language", "tool"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`skills-filter-button ${filter === type ? 'active' : ''}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="minecraft-inventory">
        <div className="skills-grid">
          {filteredSkills.map((skill, index) => (
            <div key={index} className="minecraft-item">
              <span className="skill-icon">{skill.icon}</span>
              <span className="skill-name">{skill.name}</span>
              
              <div className="skill-tooltip">
                {skill.name} {/* {skill.level}/100 */}
              </div>
            </div>
          ))}

          {/* Empty slots to fill the grid */}
          {Array.from({ length: Math.max(0, 24 - filteredSkills.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="minecraft-item-empty"></div>
          ))}
        </div>
      </div>
    </div>
  )
}