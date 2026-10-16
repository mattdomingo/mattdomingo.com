"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { cardReturnTransform, createCardReturn, type CardBounds } from "@/lib/card-motion";
import { getRandomCodingJoke } from "@/lib/coding-jokes";
import { fitFolderWidth } from "@/lib/folder-layout";
import { usePortfolioAudio } from "@/hooks/use-portfolio-audio";
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

type PreviewFile = FolderFile & { image: string; width: number; height: number; project?: { tagline: string; summary: string; tags: string[]; url: string; caption: string }; github?: boolean };

const PERSONAL_FILES: PreviewFile[] = [
  { name: "Mountains", image: "/photos/img_8427.webp", width: 1350, height: 1800 },
  { name: "TruStage", image: "/photos/internship.webp", width: 1800, height: 961 },
  { name: "Holos", image: "/photos/img_5819.webp", width: 1350, height: 1800 },
  { name: "Go Badgers", image: "/photos/img_3219.webp", width: 1350, height: 1800 },
  { name: "Résumé.pdf", meta: "PDF", image: "/documents/resume-preview.webp", width: 1360, height: 1760 },
];

const PROJECT_FILES: PreviewFile[] = [
  { name: "QuestGPT", meta: "GitHub", image: "/projects/questgpt.png", width: 800, height: 624, project: {
    tagline: "A world that writes back.",
    summary: "An AI-powered RPG that pairs dynamic storytelling with strategic combat. Build your character, face enemies that scale with your progress, and meet merchants with AI-generated personalities and backstories.",
    tags: ["Generative AI", "React", "Java · Spring Boot", "MySQL"], url: "https://github.com/mattdomingo/QuestGPT", caption: "QuestGPT project artwork",
  } },
  { name: "Recall", meta: "GitHub", image: "/projects/recall.webp", width: 1600, height: 555, project: {
    tagline: "Memory, with receipts.",
    summary: "Built for a16z SpeedHacks, Recall connects an iPhone app, a conversational phone assistant, and camera-based object memory. Ask where your keys are or what you promised to do; answers point back to timestamped photos, notes, events, or confirmed sightings.",
    tags: ["SwiftUI", "Computer vision", "Voice AI", "MCP"], url: "https://github.com/mattdomingo/speedhacks", caption: "iPhone simulator demo · fictional sample memories",
  } },
  { name: "Multiplayer AI", meta: "Open source soon", image: "/projects/multiplayer-ai.webp", width: 1280, height: 720, project: {
    tagline: "One team. An entire agent floor.",
    summary: "A shared workspace for people and AI coding agents. Persistent sessions bring live presence, task queues, and team coordination together with a GitHub-connected review flow that traces changes back to the people and agents behind them.",
    tags: ["Multi-agent systems", "Real-time collaboration", "GitHub", "Cloudflare"], url: "https://github.com/mattdomingo/openfloor", caption: "Engineering preview · open source coming soon",
  } },
  { name: "Physical AI", meta: "opnflr.com", image: "/projects/openfloor.webp", width: 1280, height: 720, project: {
    tagline: "Human experience. Robot intelligence.",
    summary: "As co-founder and CTO, I’m building the infrastructure that turns human demonstrations into task-specific datasets for robot learning. openfloor connects iPhone capture, aligned spatial signals, annotation, and review into inspectable episodes for robotics teams.",
    tags: ["Physical AI", "Spatial capture", "Data infrastructure", "Robotics"], url: "https://opnflr.com", caption: "openfloor · live website",
  } },
  { name: "GitHub", meta: "Projects", image: "/previews/github.svg", width: 544, height: 368, github: true },
];

type CardFlight = { from: CardBounds; to: CardBounds; returnMotion?: ReturnType<typeof createCardReturn> };
const RETURN_DURATION = .68;
const RETURN_EASE = [.4, 0, .2, 1] as const;

export default function PortfolioFolders() {
  const sound = usePortfolioAudio();
  const foldersRef = useRef<HTMLDivElement>(null);
  const [folderWidth, setFolderWidth] = useState(340);
  useEffect(() => {
    const element = foldersRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const resize = () => {
      const style = getComputedStyle(element);
      setFolderWidth(fitFolderWidth(element.clientWidth, element.clientHeight, Number(style.getPropertyValue("--folder-columns")), parseFloat(style.columnGap) || 0));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => observer.disconnect();
  }, []);
  const darkMode = useSyncExternalStore(subscribeTheme, getDarkMode, () => false);
  const tone = darkMode ? "dark" : "light";
  const clearRestoration = useRef<() => void>(() => {});
  const sourceRef = useRef<HTMLElement | null>(null);
  const sourceBounds = useRef<CardBounds | null>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const [settled, setSettled] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<CardFlight | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const finishIntro = useCallback(() => setIntroComplete(true), []);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewZoomed, setPreviewZoomed] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [githubJoke, setGithubJoke] = useState(() => getRandomCodingJoke());
  const shuffleGithubJoke = () => setGithubJoke(getRandomCodingJoke(githubJoke));
  const isResume = previewFile?.name === "Résumé.pdf";
  const isProject = Boolean(previewFile?.project || previewFile?.github);
  const reduceMotion = useReducedMotion();
  const openPreview = (file: PreviewFile, source: HTMLElement) => {
    sound.play("card-open");
    if (file.github) shuffleGithubJoke();
    clearRestoration.current();
    const rect = source.getBoundingClientRect();
    sourceRef.current = source;
    sourceBounds.current = rect.width ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
    source.setAttribute("data-preview-source", "");
    setClosing(false);
    setSettled(false);
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
  useEffect(() => () => { clearRestoration.current(); sourceRef.current?.removeAttribute("data-preview-source"); }, []);
  const closePreview = () => {
    if (closing) return;
    sound.play("card-close");
    const from = (revealed ? viewerRef.current : flightRef.current ?? viewerRef.current)?.getBoundingClientRect();
    const source = sourceRef.current;
    if (reduceMotion || !from?.width || !source) { setPreviewOpen(false); return; }
    // Keep focus restoration and pointer parallax from changing the destination during the handoff.
    const restingTransform = getComputedStyle(source).transform || "none";
    source.style.setProperty("--preview-rest-transform", restingTransform);
    source.setAttribute("data-preview-restoring", "");
    const pointerSurface = source.closest(".gf-root") ?? source;
    const release = () => {
      source.removeAttribute("data-preview-restoring");
      source.style.removeProperty("--preview-rest-transform");
      pointerSurface.removeEventListener("pointermove", release);
      source.removeEventListener("blur", release);
      source.removeEventListener("keydown", release);
    };
    clearRestoration.current = release;
    pointerSurface.addEventListener("pointermove", release, { once: true });
    source.addEventListener("blur", release, { once: true });
    source.addEventListener("keydown", release, { once: true });
    const to = source.getBoundingClientRect();
    if (!to.width) { release(); setPreviewOpen(false); return; }
    const returnMotion = createCardReturn(from, to, { width: source.offsetWidth || to.width, height: source.offsetHeight || to.height }, restingTransform);
    setFlight({ from, to: returnMotion.to, returnMotion });
    setSettled(false);
    setClosing(true);
  };
  const finishClose = () => {
    setClosing(false);
    setSettled(false);
    sourceRef.current?.removeAttribute("data-preview-source");
    setFlight(null);
    dialogRef.current?.close();
  };


  return (
    <>
      <audio ref={sound.musicRef} src="/audio/background-music.mp3" loop preload="none" hidden />
      <PortfolioIntro onComplete={finishIntro} />
      <div ref={foldersRef} className="portfolio-folders" style={{ "--folder-scale": folderWidth / 340 } as CSSProperties} data-intro-complete={introComplete || undefined} inert={!introComplete}>
        <GlassFolder
          width={folderWidth}
          label="Matt Domingo"
          onOpenChange={(open) => sound.play(open ? "folder-open" : "folder-close")}
          className="personal-folder"
          onFileSelect={(_, index, source) => openPreview(PERSONAL_FILES[index], source)}
          tone={tone}
          art="aurora"
          action="none"
          files={PERSONAL_FILES}
        />
        <GlassFolder
          width={folderWidth}
          label="Projects"
          onOpenChange={(open) => sound.play(open ? "folder-open" : "folder-close")}
          className="project-folder"
          tone={tone}
          art="aurora"
          action="none"
          appearDelay={140}
          onFileSelect={(_, index, source) => openPreview(PROJECT_FILES[index], source)}
          files={PROJECT_FILES}
        />
        <GlassFolder
          width={folderWidth}
          label="Connect"
          onOpenChange={(open) => sound.play(open ? "folder-open" : "folder-close")}
          onFileSelect={() => sound.play("card-open")}
          tone={tone}
          art="aurora"
          action="none"
          appearDelay={280}
          files={[
            { name: "Instagram", meta: "@matt_domingo", image: "/previews/instagram.svg", href: "https://www.instagram.com/matt_domingo/" },
            { name: "X", meta: "@opnflr_cto", image: "/previews/x.svg", href: "https://x.com/opnflr_cto" },
            { name: "Email", image: "/previews/email.svg", href: "mailto:matthew.domingo2022@gmail.com" },
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
        <AnimatePresence onExitComplete={() => { if (!previewOpen) finishClose(); }}>
          {previewOpen && previewFile && (
            <motion.div
              transformTemplate={closing ? cardReturnTransform : undefined}
              ref={viewerRef}
              key={previewFile.image}
              className="resume-viewer"
              initial={{ opacity: 0 }}
              animate={closing && flight?.returnMotion ? { ...flight.returnMotion.viewer, opacity: revealed ? [1, 1, 0, 0] : 0 } : { opacity: revealed ? 1 : 0 }}
              exit={{ opacity: 0, scale: closing || reduceMotion ? 1 : 0.94, y: closing || reduceMotion ? 0 : 18, transition: { duration: closing || reduceMotion ? 0 : .18 } }}
              transition={closing ? { duration: RETURN_DURATION, ease: RETURN_EASE, opacity: { duration: RETURN_DURATION, times: [0, .55, .7, 1], ease: "linear" } } : { duration: reduceMotion ? 0 : .18 }}
              style={{ pointerEvents: revealed && !closing ? "auto" : "none" }}
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
                  {isResume && <button type="button" aria-label={`${previewZoomed ? "Zoom out" : "Zoom in"} résumé`} aria-pressed={previewZoomed} onClick={() => setPreviewZoomed((zoomed) => !zoomed)}>
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
              {previewFile.github ? <div className="project-document"><GitHubPreview joke={githubJoke} onShuffle={shuffleGithubJoke} /></div> : previewFile.project ? (
                <article className="project-document">
                  <div className="project-copy">
                    <p className="project-eyebrow">{previewFile.name}</p>
                    <h3>{previewFile.project.tagline}</h3>
                    <p className="project-summary">{previewFile.project.summary}</p>
                    <ul className="project-tags" aria-label="Technologies and project link">{previewFile.project.tags.map((tag) => <li key={tag}>{tag}</li>)}<li className="project-repository"><RepositoryLink href={previewFile.project.url} /></li></ul>
                  </div>
                  <figure className="project-figure">
                    <Image unoptimized src={previewFile.image} alt={previewFile.project.caption} width={previewFile.width} height={previewFile.height} />
                    <figcaption className="project-caption">{previewFile.project.caption}</figcaption>
                  </figure>
                </article>
              ) : (
              <div className={`resume-document${isResume ? "" : " photo-document"}`} data-zoomed={isResume && previewZoomed || undefined} tabIndex={0} role="region" aria-label={isResume ? "Résumé preview" : "Photo preview"}>
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
            transformTemplate={closing ? cardReturnTransform : undefined}
            ref={flightRef}
            key={closing ? "return" : "lift"}
            className={`preview-flight-card${closing ? " preview-flight-return" : ""}`}
            aria-hidden="true"
            style={closing && flight.returnMotion ? { width: flight.returnMotion.cardSize.width, height: flight.returnMotion.cardSize.height, transformOrigin: "50% 50%" } : undefined}
            initial={closing && flight.returnMotion ? { ...flight.returnMotion.start, opacity: revealed ? 0 : 1 } : { ...flight.from, opacity: 1 }}
            animate={closing && flight.returnMotion ? {
              ...flight.returnMotion.end,
              opacity: settled ? 0 : revealed ? [0, 0, 1, 1] : 1,
            } : revealed ? { ...flight.to, opacity: 0 } : {
              x: [flight.from.x, flight.from.x, flight.to.x],
              y: [flight.from.y, Math.max(16, flight.from.y - 90), flight.to.y],
              width: [flight.from.width, flight.from.width, flight.to.width],
              height: [flight.from.height, flight.from.height, flight.to.height],
              opacity: 1,
            }}
            transition={closing && settled ? { duration: .1 } : closing ? { duration: RETURN_DURATION, ease: RETURN_EASE, opacity: { duration: RETURN_DURATION, times: [0, .25, .6, 1], ease: "linear" } } : revealed ? { duration: .18 } : { duration: .65, times: [0, .3, 1], ease: ["easeOut", [.22, 1, .36, 1]] }}
            onAnimationComplete={() => { if (closing && !settled) { sourceRef.current?.removeAttribute("data-preview-source"); setSettled(true); } else if (closing) { setPreviewOpen(false); finishClose(); } else if (revealed) setFlight(null); else setRevealed(true); }}
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
