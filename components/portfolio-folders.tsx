"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import GlassFolder, { type FolderFile } from "@/components/ui/glass-folder-cards";

import GitHubPreview from "@/components/github-preview";

const subscribeTheme = (callback: () => void) => {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getDarkMode = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

type PreviewFile = FolderFile & { image: string; width: number; height: number; project?: { tagline: string; summary: string; tags: string[]; url: string; link: string; caption: string }; github?: boolean };

const PERSONAL_FILES: PreviewFile[] = [
  { name: "Apple Vision Pro Enthusiast", image: "/photos/img_4991.webp", width: 1350, height: 1800 },
  { name: "Mountains", image: "/photos/img_8427.webp", width: 1350, height: 1800 },
  { name: "Trustage SWE Internship", image: "/photos/internship.webp", width: 1800, height: 961 },
  { name: "Holos", image: "/photos/img_5819.webp", width: 1350, height: 1800 },
  { name: "Go Badgers", image: "/photos/img_3219.webp", width: 1350, height: 1800 },
  { name: "Résumé.pdf", meta: "PDF", image: "/documents/resume-preview.webp", width: 1360, height: 1760 },
];

const PROJECT_FILES: PreviewFile[] = [
  { name: "QuestGPT", meta: "GitHub", image: "/projects/questgpt.png", width: 800, height: 624, project: {
    tagline: "A world that writes back.",
    summary: "An AI-powered RPG that pairs dynamic storytelling with strategic combat. Build your character, face enemies that scale with your progress, and meet merchants with AI-generated personalities and backstories—all backed by persistent game sessions.",
    tags: ["Generative AI", "React", "Java · Spring Boot", "MySQL"], url: "https://github.com/mattdomingo/QuestGPT", link: "Explore QuestGPT", caption: "QuestGPT project artwork",
  } },
  { name: "Recall", meta: "GitHub", image: "/projects/recall.webp", width: 1600, height: 555, project: {
    tagline: "Memory, with receipts.",
    summary: "Built for a16z SpeedHacks, Recall connects an iPhone app, a conversational phone assistant, and camera-based object memory. Ask where your keys are or what you promised to do; answers point back to timestamped photos, notes, events, or confirmed sightings.",
    tags: ["SwiftUI", "Computer vision", "Voice AI", "MCP"], url: "https://github.com/mattdomingo/speedhacks", link: "Explore Recall", caption: "iPhone simulator demo · fictional sample memories",
  } },
  { name: "Multiplayer AI", meta: "Open source soon", image: "/projects/multiplayer-ai.webp", width: 1280, height: 720, project: {
    tagline: "One team. An entire agent floor.",
    summary: "A shared workspace for people and AI coding agents. Persistent sessions bring live presence, task queues, and team coordination together with a GitHub-connected review flow that traces changes back to the people and agents behind them.",
    tags: ["Multi-agent systems", "Real-time collaboration", "GitHub", "Cloudflare"], url: "https://github.com/mattdomingo/openfloor", link: "View repository", caption: "Engineering preview · open source coming soon",
  } },
  { name: "openfloor", meta: "opnflr.com", image: "/projects/openfloor.webp", width: 1280, height: 720, project: {
    tagline: "Human experience. Robot intelligence.",
    summary: "As co-founder and CTO, I’m building the infrastructure that turns human demonstrations into task-specific datasets for robot learning. openfloor connects iPhone capture, aligned spatial signals, annotation, and review into inspectable episodes for robotics teams.",
    tags: ["Physical AI", "Spatial capture", "Data infrastructure", "Robotics"], url: "https://opnflr.com", link: "Visit openfloor", caption: "openfloor · live website",
  } },
  { name: "GitHub", meta: "Projects", image: "/previews/github.svg", width: 544, height: 368, github: true },
];

export default function PortfolioFolders() {
  const darkMode = useSyncExternalStore(subscribeTheme, getDarkMode, () => false);
  const tone = darkMode ? "dark" : "light";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewZoomed, setPreviewZoomed] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const isResume = previewFile?.name === "Résumé.pdf";
  const isProject = Boolean(previewFile?.project || previewFile?.github);
  const openPreview = (file: PreviewFile) => {
    setPreviewFile(file);
    setPreviewZoomed(false);
    dialogRef.current?.showModal();
    setPreviewOpen(true);
  };
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className="portfolio-folders">
        <GlassFolder
          label="Matt Domingo"
          className="personal-folder"
          onFileSelect={(_, index) => openPreview(PERSONAL_FILES[index])}
          tone={tone}
          art="aurora"
          action="none"
          files={PERSONAL_FILES}
        />
        <GlassFolder
          label="Project"
          className="project-folder"
          tone={tone}
          art="aurora"
          action="none"
          appearDelay={140}
          onFileSelect={(_, index) => openPreview(PROJECT_FILES[index])}
          files={PROJECT_FILES}
        />
        <GlassFolder
          label="Connect"
          tone={tone}
          art="aurora"
          action="none"
          appearDelay={280}
          files={[
            { name: "Instagram", meta: "@matt_domingo", image: "/previews/instagram.svg", href: "https://www.instagram.com/matt_domingo/" },
            { name: "X", meta: "@opnflr_cto", image: "/previews/x.svg", href: "https://x.com/opnflr_cto" },
            { name: "Email", meta: "Say wassup", image: "/previews/email.svg", href: "mailto:matthew.domingo2022@gmail.com" },
            { name: "LinkedIn", meta: "Connect", image: "/previews/linkedin.svg", href: "https://linkedin.com/in/matthewgdomingo" },
          ]}
        />
      </div>
      <dialog
        ref={dialogRef}
        className={`resume-dialog${isProject ? " project-dialog" : ""}`}
        aria-labelledby="resume-title"
        onCancel={(event) => {
          event.preventDefault();
          setPreviewOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            event.preventDefault();
            setPreviewOpen(false);
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPreviewOpen(false);
        }}
      >
        <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
          {previewOpen && previewFile && (
            <motion.div
              key={previewFile.image}
              className="resume-viewer"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.86, y: reduceMotion ? 0 : 36 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 18 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 290, damping: 29 }}
            >
              <header className="resume-toolbar">
                <h2 id="resume-title">{isResume ? "Matt Domingo · Résumé" : previewFile.name}</h2>
                <div className="resume-actions">
                  {isResume && <a className="resume-download" href="/documents/resume.pdf" download="Matthew_Domingo_Resume.pdf" aria-label="Download PDF">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />
                    </svg>
                    <span>Download PDF</span>
                  </a>}
                  {!isProject && <button type="button" aria-label={`${previewZoomed ? "Zoom out" : "Zoom in"} ${isResume ? "résumé" : "photo"}`} aria-pressed={previewZoomed} onClick={() => setPreviewZoomed((zoomed) => !zoomed)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="10" cy="10" r="6" />
                      <path d="m15 15 6 6M7 10h6" />
                      {!previewZoomed && <path d="M10 7v6" />}
                    </svg>
                  </button>}
                  <button type="button" autoFocus aria-label={isResume ? "Close résumé" : isProject ? "Close project" : "Close photo"} onClick={() => setPreviewOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              </header>
              {previewFile.github ? <div className="project-document"><GitHubPreview /></div> : previewFile.project ? (
                <article className="project-document">
                  <div className="project-copy">
                    <p className="project-eyebrow">{previewFile.name}</p>
                    <h3>{previewFile.project.tagline}</h3>
                    <p className="project-summary">{previewFile.project.summary}</p>
                    <ul className="project-tags" aria-label="Technologies">{previewFile.project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                    <a className="project-visit" href={previewFile.project.url} target="_blank" rel="noopener noreferrer">{previewFile.project.link} <span aria-hidden="true">↗</span></a>
                  </div>
                  <figure className="project-figure">
                    <Image unoptimized src={previewFile.image} alt={previewFile.project.caption} width={previewFile.width} height={previewFile.height} />
                    <figcaption className="project-caption">{previewFile.project.caption}</figcaption>
                  </figure>
                </article>
              ) : (
              <div className={`resume-document${isResume ? "" : " photo-document"}`} data-zoomed={previewZoomed || undefined} tabIndex={0} role="region" aria-label={isResume ? "Résumé preview" : "Photo preview"}>
                <Image
                  unoptimized
                  src={previewFile.image}
                  alt={isResume ? "Matthew Domingo's résumé. Download the PDF for selectable text and links." : previewFile.name}
                  width={previewFile.width}
                  height={previewFile.height}
                  sizes="(max-width: 900px) 95vw, 864px"
                />
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
