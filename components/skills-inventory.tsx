"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const skills = [
  { name: "JavaScript", level: 90, type: "language", icon: "🟨" },
  { name: "TypeScript", level: 85, type: "language", icon: "🔷" },
  { name: "React", level: 88, type: "framework", icon: "⚛️" },
  { name: "Next.js", level: 82, type: "framework", icon: "▲" },
  { name: "Node.js", level: 80, type: "language", icon: "🟢" },
  { name: "HTML/CSS", level: 95, type: "language", icon: "🌐" },
  { name: "Tailwind", level: 87, type: "framework", icon: "🎨" },
  { name: "Git", level: 85, type: "tool", icon: "📂" },
  { name: "Docker", level: 75, type: "tool", icon: "🐳" },
  { name: "AWS", level: 70, type: "tool", icon: "☁️" },
  { name: "MongoDB", level: 78, type: "database", icon: "🍃" },
  { name: "PostgreSQL", level: 75, type: "database", icon: "🐘" },
]

export default function SkillsInventory() {
  const [filter, setFilter] = useState("all")

  const filteredSkills = filter === "all" ? skills : skills.filter((skill) => skill.type === filter)

  return (
    <div className="mt-16">
      <h3 className="minecraft-text text-2xl mb-6 text-center">SKILLS INVENTORY</h3>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {["all", "language", "framework", "tool", "database"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-3 py-1 border-2 border-gray-700 text-sm uppercase",
              filter === type
                ? "bg-[#7CB342] text-white"
                : "bg-gray-800 bg-opacity-70 text-gray-300 hover:bg-opacity-90",
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="minecraft-inventory bg-[#8B4513] bg-opacity-80 border-4 border-[#5D2906] p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className="minecraft-item bg-[#C6C6C6] border-2 border-[#555555] p-2 aspect-square relative group"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-2xl mb-1">{skill.icon}</span>
                <span className="text-xs text-center">{skill.name}</span>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                <div className="h-full bg-green-500" style={{ width: `${skill.level}%` }}></div>
              </div>

              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 text-white p-2 border border-gray-700 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {skill.name}: {skill.level}/100
              </div>
            </div>
          ))}

          {/* Empty slots to fill the grid */}
          {Array.from({ length: Math.max(0, 24 - filteredSkills.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="minecraft-item-empty bg-[#8B4513] border-2 border-[#5D2906] p-2 aspect-square opacity-50"
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
