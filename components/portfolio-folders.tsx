"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import GlassFolder, { type FolderFile } from "@/components/ui/glass-folder-cards";

type PreviewFile = FolderFile & { image: string; width: number; height: number };

const PERSONAL_FILES: PreviewFile[] = [
  { name: "Apple Vision Pro Enthusiast", image: "/photos/img_4991.webp", width: 1350, height: 1800 },
  { name: "Mountains", image: "/photos/img_8427.webp", width: 1350, height: 1800 },
  { name: "Trustage SWE Internship", image: "/photos/internship.webp", width: 1800, height: 961 },
  { name: "Holos", image: "/photos/img_5819.webp", width: 1350, height: 1800 },
  { name: "Go Badgers", image: "/photos/img_3219.webp", width: 1350, height: 1800 },
  { name: "Résumé.pdf", meta: "PDF", image: "/documents/resume-preview.webp", width: 1360, height: 1760 },
];

export default function PortfolioFolders() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewZoomed, setPreviewZoomed] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const isResume = previewFile?.name === "Résumé.pdf";
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className="portfolio-folders">
        <GlassFolder
          label="Matt Domingo"
          className="personal-folder"
          onFileSelect={(_, index) => {
            setPreviewFile(PERSONAL_FILES[index]);
            setPreviewZoomed(false);
            dialogRef.current?.showModal();
            setPreviewOpen(true);
          }}
          tone="light"
          art="aurora"
          action="none"
          files={PERSONAL_FILES}
        />
        <GlassFolder
          label="Project"
          className="project-folder"
          tone="light"
          art="aurora"
          action="none"
          appearDelay={140}
          files={[
            { name: "QuestGPT", meta: "GitHub", image: "/projects/questgpt.png", href: "https://github.com/mattdomingo/QuestGPT" },
            { name: "Recall", meta: "GitHub", image: "/previews/recall.svg", href: "https://github.com/mattdomingo/speedhacks" },
            { name: "Multiplayer AI", meta: "Open source soon", image: "/previews/multiplayer-ai.svg", href: "https://github.com/mattdomingo/openfloor" },
            { name: "openfloor", meta: "opnflr.com", image: "/previews/openfloor.svg", href: "https://opnflr.com" },
            { name: "GitHub", meta: "Projects", image: "/previews/github.svg", href: "https://github.com/mattdomingo" },
          ]}
        />
        <GlassFolder
          label="Connect"
          tone="light"
          art="aurora"
          action="none"
          appearDelay={280}
          files={[
            { name: "Instagram", meta: "@matt_domingo", image: "/previews/instagram.svg", href: "https://www.instagram.com/matt_domingo/" },
            { name: "X", meta: "@opnflr_cto", image: "/previews/x.svg", href: "https://x.com/opnflr_cto" },
            { name: "Email", meta: "Say hello", image: "/previews/email.svg", href: "mailto:matthew.domingo2022@gmail.com" },
            { name: "LinkedIn", meta: "Connect", image: "/previews/linkedin.svg", href: "https://linkedin.com/in/matthewgdomingo" },
          ]}
        />
      </div>
      <dialog
        ref={dialogRef}
        className="resume-dialog"
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
                  <button type="button" aria-label={`${previewZoomed ? "Zoom out" : "Zoom in"} ${isResume ? "résumé" : "photo"}`} aria-pressed={previewZoomed} onClick={() => setPreviewZoomed((zoomed) => !zoomed)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="10" cy="10" r="6" />
                      <path d="m15 15 6 6M7 10h6" />
                      {!previewZoomed && <path d="M10 7v6" />}
                    </svg>
                  </button>
                  <button type="button" autoFocus aria-label={isResume ? "Close résumé" : "Close photo"} onClick={() => setPreviewOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              </header>
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
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
