"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";

const technologies = [
  "All",
  ...Array.from(
    new Set(projects.flatMap((project) => project.technologies)),
  ).sort(),
];

export function ProjectArchive() {
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((project) => project.technologies.includes(filter));
  return (
    <>
      <div className="archive-toolbar">
        <span className="mono" role="status">
          {String(filtered.length).padStart(2, "0")} PROJECTS /{" "}
          {filter.toUpperCase()}
        </span>
        <label htmlFor="project-filter">
          Filter by technology{" "}
          <select
            id="project-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            {technologies.map((technology) => (
              <option key={technology}>{technology}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="archive-grid">
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="archive-card"
          >
            <div
              className={`archive-image ${!project.image ? "type-cover" : ""}`}
            >
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title} interface`}
                  width={900}
                  height={600}
                  sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 30vw"
                />
              ) : (
                <>
                  <span className="mono">
                    {project.id === 17
                      ? "PEOPLE + AGENTS"
                      : "LANGUAGE + OPPORTUNITY"}
                  </span>
                  <strong>
                    {project.title === "Openfloor"
                      ? "Open\nfloor."
                      : "Perfect\nCandidate."}
                  </strong>
                  <span className="cover-cross" aria-hidden="true">
                    +
                  </span>
                </>
              )}
              <span className="card-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
            <div className="archive-card-info">
              <span className="mono">
                {String(project.id).padStart(2, "0")} /{" "}
                {project.technologies.slice(0, 2).join(" + ")}
              </span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
