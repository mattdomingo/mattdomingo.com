"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Let the browser animate the reveal instead of rebuilding an SVG blur every frame.
export function MorphingText({ texts, className, onComplete }: { texts: string[]; className?: string; onComplete?: () => void }) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const completed = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const reduceMotion = useReducedMotion();
  const staticText = reduceMotion || texts.length < 2;
  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    completeRef.current?.();
  };

  useEffect(() => {
    if (staticText && !completed.current) {
      completed.current = true;
      completeRef.current?.();
    }
  }, [staticText]);

  useEffect(() => {
    let alive = true;
    let fontsReady = !document.fonts;
    const update = () => { if (alive) setReady(fontsReady && !document.hidden); };
    if (document.fonts) void document.fonts.ready.then(() => { fontsReady = true; update(); });
    update();
    document.addEventListener("visibilitychange", update);
    return () => { alive = false; document.removeEventListener("visibilitychange", update); };
  }, []);

  return (
    <div className={cn("liquid-text", staticText && "liquid-text-static", className)} data-ready={ready || undefined}>
      {staticText ? <span>{texts.at(-1) ?? ""}</span> : (
        <div key={index}>
          <span className="liquid-text-out">{texts[index]}</span>
          <span className="liquid-text-in" onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget || event.animationName !== "liquid-reveal") return;
            if (index < texts.length - 2) setIndex(index + 1);
            else finish();
          }}>{texts[index + 1]}</span>
        </div>
      )}
    </div>
  );
}
