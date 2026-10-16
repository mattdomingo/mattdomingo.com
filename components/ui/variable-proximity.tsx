"use client";

// Adapted from Variable Proximity by Cojeev (MIT), using the portfolio's variable font and styles.
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type VariableProximityProps = {
  text: string;
  className?: string;
  radius?: number;
  fromWeight?: number;
  toWeight?: number;
  paused?: boolean;
};

export function VariableProximity({ text, className, radius = 120, fromWeight = 400, toWeight = 800, paused = false }: VariableProximityProps) {
  const host = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const point = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const running = !reducedMotion && !paused;
  const from = Math.max(100, Math.min(900, fromWeight));
  const to = Math.max(100, Math.min(900, toWeight));
  const paint = useCallback(() => {
    const letters = Array.from(host.current?.querySelectorAll<HTMLElement>("[data-proximity-letter]") ?? []);
    const bounds = letters.map((letter) => letter.getBoundingClientRect());
    letters.forEach((letter, index) => {
      const rect = bounds[index];
      const distance = point.current && running ? Math.hypot(point.current.x - rect.x - rect.width / 2, point.current.y - rect.y - rect.height / 2) : Infinity;
      const proximity = 1 - Math.min(1, distance / Math.max(1, radius));
      const weight = from + (to - from) * proximity * proximity * (3 - 2 * proximity);
      letter.style.fontVariationSettings = `"wght" ${weight}`;
    });
  }, [from, to, radius, running]);

  useEffect(() => {
    point.current = null;
    paint();
    return () => { cancelAnimationFrame(frame.current); frame.current = 0; };
  }, [paint, text]);

  return (
    <span
      ref={host}
      className={cn("variable-proximity", className)}
      data-running={running}
      onPointerMove={(event) => {
        if (event.pointerType === "touch" || !running) return;
        point.current = { x: event.clientX, y: event.clientY };
        if (frame.current) return;
        frame.current = requestAnimationFrame(() => { frame.current = 0; paint(); });
      }}
      onPointerLeave={() => { point.current = null; cancelAnimationFrame(frame.current); frame.current = 0; paint(); }}
    >
      <span className="variable-proximity__accessible">{text}</span>
      <span aria-hidden="true">
        {Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), ({ segment }, index) => (
          <span className="variable-proximity__letter" key={index}>
            {/* Reserve the bold letter's width so the heading stays still as its weight changes. */}
            <span className="variable-proximity__measure" style={{ fontVariationSettings: `"wght" ${to}` }}>{segment}</span>
            <span data-proximity-letter="" style={{ fontVariationSettings: `"wght" ${from}` }}>{segment}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
