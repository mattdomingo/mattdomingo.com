import type { Metadata } from "next";
import { ProjectArchive } from "@/components/project-archive";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Explore Matt Domingo’s projects in collaborative AI, physical AI, web applications, and systems engineering.",
};

export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <p className="eyebrow">THE PROJECT ARCHIVE / 2024 — 2026</p>
      <h1 className="page-heading">
        Always building.
        <br />
        <em>Always learning.</em>
      </h1>
      <p className="page-intro">
        Products with users. Systems with constraints. Experiments that started
        with “what if?”
      </p>
      <ProjectArchive />
    </div>
  );
}
