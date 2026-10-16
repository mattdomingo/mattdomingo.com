"use client";

// Adapted from Variable Proximity by Cojeev (MIT), using the portfolio's variable font and styles.
import { useCallback, useEffect, useRef, type PointerEvent } from "react";
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
  const sweepFrame = useRef(0);
  const releaseTimer = useRef<number | undefined>(undefined);
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

  const stopSweep = useCallback(() => {
    cancelAnimationFrame(sweepFrame.current);
    sweepFrame.current = 0;
  }, []);
  const reset = useCallback(() => {
    stopSweep();
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    window.clearTimeout(releaseTimer.current);
    point.current = null;
    paint();
  }, [paint, stopSweep]);

  useEffect(() => {
    reset();
    if (!running) return reset;
    let startedAt: number | null = null;
    const sweep = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / 1000);
      const rect = host.current?.getBoundingClientRect();
      if (!rect) return;
      point.current = { x: rect.left - radius + (rect.width + radius * 2) * progress, y: rect.top + rect.height / 2 };
      paint();
      if (progress < 1) sweepFrame.current = requestAnimationFrame(sweep);
      else { sweepFrame.current = 0; point.current = null; paint(); }
    };
    sweepFrame.current = requestAnimationFrame(sweep);
    return reset;
  }, [paint, radius, reset, running, text]);

  const trackPointer = (event: PointerEvent<HTMLSpanElement>, immediate = false) => {
    if (!running) return;
    stopSweep();
    window.clearTimeout(releaseTimer.current);
    point.current = { x: event.clientX, y: event.clientY };
    if (immediate) paint();
    else if (!frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; paint(); });
  };

  return (
    <span
      ref={host}
      className={cn("variable-proximity", className)}
      data-running={running}
      onPointerDown={(event) => trackPointer(event, true)}
      onPointerMove={(event) => trackPointer(event)}
      onPointerUp={(event) => {
        if (running && event.pointerType === "touch") releaseTimer.current = window.setTimeout(reset, 250);
      }}
      onPointerCancel={reset}
      onPointerLeave={(event) => { if (event.pointerType !== "touch") reset(); }}
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
