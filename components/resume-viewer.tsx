"use client";

import { useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";

const versions = {
  "Full Stack": "/documents/resume.pdf",
  "Applied AI": "/documents/resume-applied-ai.pdf",
} as const;
export function ResumeViewer() {
  const [version, setVersion] = useState<keyof typeof versions>("Full Stack");
  const source = versions[version];
  return (
    <>
      <div className="resume-toolbar">
        <div className="skill-filters" role="group" aria-label="Résumé version">
          {Object.keys(versions).map((name) => (
            <button
              key={name}
              aria-pressed={version === name}
              onClick={() => setVersion(name as keyof typeof versions)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="inline-links">
          <a
            href={source}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Open PDF <ArrowUpRight size={16} />
          </a>
          <a
            href={source}
            download={`Matthew_Domingo_${version.replace(" ", "_")}_Resume.pdf`}
            className="button button-accent"
          >
            Download <Download size={16} />
          </a>
        </div>
      </div>
      <p className="resume-help">
        The full PDF is below. If your browser doesn’t display it, use Open PDF
        or Download.
      </p>
      <iframe
        key={source}
        src={`${source}#view=FitH`}
        title={`Matthew Domingo — ${version} résumé`}
        className="resume-frame"
      />
    </>
  );
}
