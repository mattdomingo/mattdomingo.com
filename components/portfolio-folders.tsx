"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import GlassFolder from "@/components/ui/glass-folder-cards";

export default function PortfolioFolders() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeZoomed, setResumeZoomed] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className="portfolio-folders">
        <GlassFolder
          label="Matt Domingo"
          className="resume-folder"
          onFileSelect={() => {
            setResumeZoomed(false);
            dialogRef.current?.showModal();
            setResumeOpen(true);
          }}
          tone="light"
          art="aurora"
          seed={3}
          action="none"
          files={[
            { name: "Résumé.pdf", meta: "PDF", image: "/documents/resume-preview.webp" },
          ]}
        />
        <GlassFolder
          label="Project"
          tone="light"
          art="aurora"
          seed={3}
          action="none"
          appearDelay={140}
          files={[
            { name: "GitHub", meta: "Projects", art: "ember", href: "https://github.com/mattdomingo" },
          ]}
        />
        <GlassFolder
          label="Connect"
          tone="light"
          art="aurora"
          seed={3}
          action="none"
          appearDelay={280}
          files={[
            { name: "LinkedIn", meta: "Connect", art: "glacier", href: "https://linkedin.com/in/matthewgdomingo" },
            { name: "Email", meta: "Say hello", href: "mailto:matthew.domingo2022@gmail.com" },
            { name: "Instagram", meta: "@matt_domingo", href: "https://www.instagram.com/matt_domingo/" },
            { name: "X", meta: "@opnflr_cto", href: "https://x.com/opnflr_cto" },
          ]}
        />
      </div>
      <dialog
        ref={dialogRef}
        className="resume-dialog"
        aria-labelledby="resume-title"
        onCancel={(event) => {
          event.preventDefault();
          setResumeOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            event.preventDefault();
            setResumeOpen(false);
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setResumeOpen(false);
        }}
      >
        <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
          {resumeOpen && (
            <motion.div
              key="resume"
              className="resume-viewer"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.86, y: reduceMotion ? 0 : 36 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 18 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 290, damping: 29 }}
            >
              <header className="resume-toolbar">
                <h2 id="resume-title">Matt Domingo · Résumé</h2>
                <div className="resume-actions">
                  <a className="resume-download" href="/documents/resume.pdf" download="Matthew_Domingo_Resume.pdf" aria-label="Download PDF">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />
                    </svg>
                    <span>Download PDF</span>
                  </a>
                  <button type="button" aria-label={resumeZoomed ? "Zoom out résumé" : "Zoom in résumé"} aria-pressed={resumeZoomed} onClick={() => setResumeZoomed((zoomed) => !zoomed)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="10" cy="10" r="6" />
                      <path d="m15 15 6 6M7 10h6" />
                      {!resumeZoomed && <path d="M10 7v6" />}
                    </svg>
                  </button>
                  <button type="button" autoFocus aria-label="Close résumé" onClick={() => setResumeOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              </header>
              <div className="resume-document" data-zoomed={resumeZoomed || undefined} tabIndex={0} role="region" aria-label="Résumé preview">
                <Image
                  src="/documents/resume-preview.webp"
                  alt="Matthew Domingo's résumé. Download the PDF for selectable text and links."
                  width={1360}
                  height={1760}
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
