"use client";

import { useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue } from "framer-motion";
import { Github, Globe } from "lucide-react";

export default function RepositoryLink({ href, label = href.startsWith("https://github.com/") ? "View Repository" : "Visit Website" }: { href: string; label?: string }) {
  const Icon = href.startsWith("https://github.com/") ? Github : Globe;
  const id = useId();
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const position = (left: number, top: number) => {
    const width = tooltipRef.current?.offsetWidth ?? 160;
    x.set(Math.max(8, Math.min(left, window.innerWidth - width - 8)));
    y.set(Math.max(8, Math.min(top, window.innerHeight - 40)));
  };
  return (
    <>
      <a
        className="repository-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        aria-describedby={visible ? id : undefined}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          setHost(event.currentTarget.closest("dialog") ?? document.body);
          position(event.clientX + 14, event.clientY + 18);
          setVisible(true);
        }}
        onPointerMove={(event) => { if (event.pointerType !== "touch") position(event.clientX + 14, event.clientY + 18); }}
        onPointerLeave={() => setVisible(false)}
        onFocus={(event) => {
          if (!event.currentTarget.matches(":focus-visible")) return;
          const rect = event.currentTarget.getBoundingClientRect();
          setHost(event.currentTarget.closest("dialog") ?? document.body);
          position(rect.left, rect.bottom + 10);
          setVisible(true);
        }}
        onBlur={() => setVisible(false)}
      >
        <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
      </a>
      {visible && host && createPortal(
        <motion.span ref={tooltipRef} id={id} role="tooltip" className="repository-tooltip" style={{ x, y }}>{label}</motion.span>, host,
      )}
    </>
  );
}
