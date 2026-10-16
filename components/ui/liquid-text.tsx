"use client";

import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const MORPH_TIME = 1100;
const HOLD_TIME = 1200;

// The supplied liquid-text blur/threshold effect, played through once for the intro.
export function MorphingText({ texts, className, onComplete }: { texts: string[]; className?: string; onComplete?: () => void }) {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const reduceMotion = useReducedMotion();
  const filterId = `liquid-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const first = text1Ref.current;
    const second = text2Ref.current;
    if (!first || !second) return;
    if (reduceMotion || texts.length < 2) {
      second.textContent = texts.at(-1) ?? "";
      second.style.opacity = "1";
      completeRef.current?.();
      return;
    }
    let frame = 0;
    let startedAt: number | null = null;
    const animate = (now: number) => {
      // Loading or a background tab can delay the first frame; it must still start at the beginning.
      startedAt ??= now;
      const elapsed = now - startedAt;
      const index = Math.min(texts.length - 2, Math.floor(elapsed / (MORPH_TIME + HOLD_TIME)));
      const fraction = Math.min(1, (elapsed - index * (MORPH_TIME + HOLD_TIME)) / MORPH_TIME);
      const invertedFraction = 1 - fraction;
      first.textContent = texts[index];
      second.textContent = texts[index + 1];
      second.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      second.style.opacity = `${Math.pow(fraction, .4)}`;
      first.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      first.style.opacity = `${Math.pow(invertedFraction, .4)}`;
      if (elapsed >= (texts.length - 1) * (MORPH_TIME + HOLD_TIME)) completeRef.current?.();
      else frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [texts, reduceMotion]);

  return (
    <>
      <div className={cn("liquid-text", className)} style={{ filter: `url(#${filterId}) blur(.6px)` }}>
        <span ref={text1Ref} />
        <span ref={text2Ref} />
      </div>
      <svg className="liquid-text-filters" aria-hidden="true" width="0" height="0">
        <defs><filter id={filterId}><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140" /></filter></defs>
      </svg>
    </>
  );
}
