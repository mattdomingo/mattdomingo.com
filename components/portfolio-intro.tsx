"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MorphingText } from "@/components/ui/liquid-text";
import { VariableProximity } from "@/components/ui/variable-proximity";

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
        if (settling && event.target === event.currentTarget && event.propertyName === "transform") finish();
      }}
    >
      <h1 className={complete ? "portfolio-name-heading" : "portfolio-name-label"}>
        {complete ? <VariableProximity text="Matt Domingo" fromWeight={380} toWeight={560} /> : "Matt Domingo"}
      </h1>
      {!complete && <div aria-hidden="true"><MorphingText texts={INTRO_TEXTS} onComplete={finishText} /></div>}
    </header>
  );
}
