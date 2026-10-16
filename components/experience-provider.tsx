"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";

type Preferences = {
  theme: "dark" | "light";
  reducedMotion: boolean;
  toggleTheme: () => void;
  toggleMotion: () => void;
};
const ExperienceContext = createContext<Preferences | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [paused, setPaused] = useState(false);
  const [systemReduced, setSystemReduced] = useState(true);
  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    );
    try {
      setPaused(localStorage.getItem("portfolio-motion") === "paused");
    } catch {
      /* Storage may be unavailable. */
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const reducedMotion = paused || systemReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion
      ? "reduced"
      : "full";
  }, [reducedMotion]);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Retain in memory. */
    }
  }
  function toggleMotion() {
    const next = !paused;
    setPaused(next);
    try {
      localStorage.setItem("portfolio-motion", next ? "paused" : "full");
    } catch {
      /* Retain in memory. */
    }
  }
  return (
    <ExperienceContext.Provider
      value={{ theme, reducedMotion, toggleTheme, toggleMotion }}
    >
      <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
        {children}
      </MotionConfig>
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context)
    throw new Error("useExperience must be used within ExperienceProvider");
  return context;
}
