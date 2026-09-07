"use client";

import { useState } from "react";
import { skillGroups } from "@/lib/profile";

export default function SkillsInventory() {
  const [filter, setFilter] = useState("All");
  const groups =
    filter === "All"
      ? skillGroups
      : skillGroups.filter((group) => group.name === filter);
  return (
    <section className="skills-section" aria-labelledby="skills-title">
      <p className="eyebrow">02 / THE TOOLKIT</p>
      <h2 id="skills-title">
        Choose the right tool.
        <br />
        <em>Know what’s underneath.</em>
      </h2>
      <div className="skill-filters" role="group" aria-label="Filter skills">
        {["All", ...skillGroups.map((group) => group.name)].map((name) => (
          <button
            key={name}
            onClick={() => setFilter(name)}
            aria-pressed={filter === name}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="skills-groups">
        {groups.map((group) => (
          <div key={group.name}>
            <h3>{group.name}</h3>
            <div className="tag-list">
              {group.skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
