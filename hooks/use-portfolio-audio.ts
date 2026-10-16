"use client";

import { useCallback, useEffect, useRef } from "react";
import { playPortfolioSound, type PortfolioSound } from "@/lib/portfolio-sounds";

export function usePortfolioAudio() {
  const audio = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const stop = useCallback(() => {
    const context = audio.current;
    audio.current = null;
    if (context) void context.close().catch(() => {});
  }, []);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    const track = musicRef.current;
    if (!track) return;
    const start = () => {
      if (!track.paused) return;
      void track.play().catch(() => {});
    };
    window.addEventListener("click", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("click", start);
      window.removeEventListener("keydown", start);
      if (!track.paused) track.pause();
    };
  }, []);

  const play = useCallback((sound: PortfolioSound) => {
    if (typeof window.AudioContext !== "function") return;
    try {
      if (!audio.current || audio.current.state === "closed") audio.current = new window.AudioContext();
      const context = audio.current;
      if (context.state === "suspended") void context.resume().catch(() => {});
      playPortfolioSound(context, sound);
    } catch { /* Optional audio must never interrupt navigation. */ }
  }, []);
  return { play, musicRef };
}
