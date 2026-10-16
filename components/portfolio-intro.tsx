"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MorphingText } from "@/components/ui/liquid-text";

const INTRO_TEXTS = ["", "Matt Domingo"];

export default function PortfolioIntro({ onComplete }: { onComplete: () => void }) {
  const [settling, setSettling] = useState(false);
  const [complete, setComplete] = useState(false);
  const completedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const finishText = useCallback(() => setSettling(true), []);
  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setComplete(true);
    onComplete();
  }, [onComplete]);
  useEffect(() => {
    if (reduceMotion) {
      setSettling(true);
      finish();
    }
  }, [reduceMotion, finish]);
  return (
    <header
      className={`portfolio-name${complete ? "" : " portfolio-intro"}`}
      data-settled={settling || undefined}
      onTransitionEnd={(event) => {
        if (settling && event.target === event.currentTarget && event.propertyName === "top") finish();
      }}
    >
      <h1 className="portfolio-name-label">Matt Domingo</h1>
      <div aria-hidden="true"><MorphingText texts={INTRO_TEXTS} onComplete={finishText} /></div>
    </header>
  );
}
