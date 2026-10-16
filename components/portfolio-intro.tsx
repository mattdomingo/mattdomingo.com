"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MorphingText } from "@/components/ui/liquid-text";

const INTRO_TEXTS = ["", "Matt Domingo"];

export default function PortfolioIntro({ onComplete }: { onComplete: () => void }) {
  const [finished, setFinished] = useState(false);
  const reduceMotion = useReducedMotion();
  const finishText = useCallback(() => setFinished(true), []);
  useEffect(() => { if (reduceMotion) onComplete(); }, [reduceMotion, onComplete]);
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!finished && !reduceMotion && (
        <motion.div className="portfolio-intro" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.035, filter: "blur(8px)" }} transition={{ duration: .4, ease: "easeInOut" }}>
          <MorphingText texts={INTRO_TEXTS} onComplete={finishText} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
