"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import GlassFolder, { type FolderFile } from "@/components/ui/glass-folder-cards";

import RepositoryLink from "@/components/repository-link";
import PortfolioIntro from "@/components/portfolio-intro";
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

type CardBounds = { x: number; y: number; width: number; height: number };
type CardFlight = { from: CardBounds; to: CardBounds };

export default function PortfolioFolders() {
  const darkMode = useSyncExternalStore(subscribeTheme, getDarkMode, () => false);
  const tone = darkMode ? "dark" : "light";
  const sourceRef = useRef<HTMLElement | null>(null);
  const sourceBounds = useRef<CardBounds | null>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<CardFlight | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const finishIntro = useCallback(() => setIntroComplete(true), []);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewZoomed, setPreviewZoomed] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const isResume = previewFile?.name === "Résumé.pdf";
  const isProject = Boolean(previewFile?.project || previewFile?.github);
  const reduceMotion = useReducedMotion();
  const openPreview = (file: PreviewFile, source: HTMLElement) => {
    const rect = source.getBoundingClientRect();
    sourceRef.current = source;
    sourceBounds.current = rect.width ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
    source.setAttribute("data-preview-source", "");
    setClosing(false);
    setRevealed(Boolean(reduceMotion || !rect.width));
    setFlight(null);
    setPreviewFile(file);
    setPreviewZoomed(false);
    dialogRef.current?.showModal();
    setPreviewOpen(true);
  };
  useLayoutEffect(() => {
    if (!previewOpen) return;
    if (reduceMotion) { if (closing) setPreviewOpen(false); setFlight(null); setRevealed(true); return; }
    if (closing) return;
    if (!sourceBounds.current) return;
    const rect = viewerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setFlight({ from: sourceBounds.current, to: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } });
  }, [previewOpen, previewFile, reduceMotion, closing]);
  useEffect(() => () => { sourceRef.current?.removeAttribute("data-preview-source"); }, []);
  const closePreview = () => {
    if (closing) return;
    const from = (flightRef.current ?? viewerRef.current)?.getBoundingClientRect();
    const to = sourceRef.current?.getBoundingClientRect();
    if (reduceMotion || !from?.width || !to?.width) { setPreviewOpen(false); return; }
    setFlight({ from: { x: from.x, y: from.y, width: from.width, height: from.height }, to: { x: to.x, y: to.y, width: to.width, height: to.height } });
    setClosing(true);
    setRevealed(false);
  };
  const finishClose = () => {
    setClosing(false);
    sourceRef.current?.removeAttribute("data-preview-source");
    setFlight(null);
    dialogRef.current?.close();
  };


  return (
    <>
      <PortfolioIntro onComplete={finishIntro} />
      <div className="portfolio-folders" data-intro-complete={introComplete || undefined} inert={!introComplete}>
        <GlassFolder
          label="Matt Domingo"
          className="personal-folder"
          onFileSelect={(_, index, source) => openPreview(PERSONAL_FILES[index], source)}
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
          onFileSelect={(_, index, source) => openPreview(PROJECT_FILES[index], source)}
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
        data-returning={closing || undefined}
        onCancel={(event) => {
          event.preventDefault();
          closePreview();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            event.preventDefault();
            closePreview();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}
      >
        <AnimatePresence onExitComplete={finishClose}>
          {previewOpen && previewFile && (
            <motion.div
              ref={viewerRef}
              key={previewFile.image}
              className="resume-viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 18 }}
              transition={{ duration: reduceMotion ? 0 : .18 }}
              style={{ pointerEvents: revealed ? "auto" : "none" }}
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
                  <button type="button" autoFocus aria-label={isResume ? "Close résumé" : isProject ? "Close project" : "Close photo"} onClick={closePreview}>
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
                    <ul className="project-tags" aria-label="Technologies and repository">{previewFile.project.tags.map((tag) => <li key={tag}>{tag}</li>)}{previewFile.project.url.startsWith("https://github.com/") && <li className="project-repository"><RepositoryLink href={previewFile.project.url} /></li>}</ul>
                    {!previewFile.project.url.startsWith("https://github.com/") && <a className="project-visit" href={previewFile.project.url} target="_blank" rel="noopener noreferrer">{previewFile.project.link} <span aria-hidden="true">↗</span></a>}
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
        {previewOpen && previewFile && flight && (
          <motion.div
            ref={flightRef}
            key={closing ? "return" : "lift"}
            className={`preview-flight-card${closing ? " preview-flight-return" : ""}`}
            aria-hidden="true"
            initial={{ ...flight.from, opacity: closing ? 0 : 1 }}
            animate={closing ? {
              x: [flight.from.x, flight.to.x, flight.to.x],
              y: [flight.from.y, Math.max(16, flight.to.y - 90), flight.to.y],
              width: [flight.from.width, flight.to.width, flight.to.width],
              height: [flight.from.height, flight.to.height, flight.to.height],
              opacity: [0, 1, 1],
            } : revealed ? { ...flight.to, opacity: 0 } : {
              x: [flight.from.x, flight.from.x, flight.to.x],
              y: [flight.from.y, Math.max(16, flight.from.y - 90), flight.to.y],
              width: [flight.from.width, flight.from.width, flight.to.width],
              height: [flight.from.height, flight.from.height, flight.to.height],
              opacity: 1,
            }}
            transition={closing ? { duration: .65, times: [0, .7, 1], ease: [[.22, 1, .36, 1], "easeInOut"] } : revealed ? { duration: .18 } : { duration: .65, times: [0, .3, 1], ease: ["easeOut", [.22, 1, .36, 1]] }}
            onAnimationComplete={() => { if (closing) { sourceRef.current?.removeAttribute("data-preview-source"); setPreviewOpen(false); } else if (revealed) setFlight(null); else setRevealed(true); }}
          >
            {/* The flight keeps the same artwork and label as the selected folder card. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewFile.image} alt="" />
            <div className="preview-flight-label"><span>{previewFile.name}</span><span>{previewFile.meta}</span></div>
          </motion.div>
        )}
      </dialog>
    </>
  );
}
