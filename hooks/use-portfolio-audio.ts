"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playPortfolioSound, type PortfolioSound } from "@/lib/portfolio-sounds";

const PREFERENCE_KEY = "portfolio-sounds";

export function usePortfolioAudio() {
  const [enabled, setEnabled] = useState(true);
  const audio = useRef<AudioContext | null>(null);
  const stop = useCallback(() => {
    const context = audio.current;
    audio.current = null;
    if (context) void context.close().catch(() => {});
  }, []);

  useEffect(() => {
    try { setEnabled(localStorage.getItem(PREFERENCE_KEY) !== "off"); } catch { /* Storage can be unavailable in private sessions. */ }
    return stop;
  }, [stop]);

  const play = useCallback((sound: PortfolioSound) => {
    if (!enabled || typeof window.AudioContext !== "function") return;
    try {
      if (!audio.current || audio.current.state === "closed") audio.current = new window.AudioContext();
      const context = audio.current;
      if (context.state === "suspended") void context.resume().catch(() => {});
      playPortfolioSound(context, sound);
    } catch { /* Optional audio must never interrupt navigation. */ }
  }, [enabled]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) stop();
    try { localStorage.setItem(PREFERENCE_KEY, next ? "on" : "off"); } catch { /* The switch still works without storage. */ }
  };
  return { enabled, toggle, play };
}
