"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useExperience } from "./experience-provider";

export function ScrollChapter({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { reducedMotion } = useExperience();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [7, 0, 0, -3],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.92, 1, 1, 0.96],
  );
  return (
    <section
      ref={ref}
      className="work-chapter"
      aria-labelledby={`work-title-${index}`}
    >
      <motion.div
        className="work-panel"
        style={reducedMotion ? undefined : { rotateX, scale }}
      >
        {children}
      </motion.div>
    </section>
  );
}
