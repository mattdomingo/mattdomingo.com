"use client";

import { useEffect, useState } from "react";
import RepositoryLink from "@/components/repository-link";
import dynamic from "next/dynamic";
import type { GitHubContributions } from "@/lib/github-contributions";

const ContributionSkyline = dynamic(() => import("@/components/ui/contribution-skyline"), { ssr: false, loading: () => <p role="status">Building your skyline…</p> });

export default function GitHubPreview() {
  const [calendar, setCalendar] = useState<GitHubContributions | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    fetch("/api/github-contributions", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        return response.json() as Promise<GitHubContributions>;
      })
      .then(setCalendar)
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [attempt]);

  return (
    <div className="github-preview">
      <p className="project-eyebrow">@mattdomingo · A year of building</p>
      <p className="github-intro">Every contribution, another building block.</p>
      {calendar ? <ContributionSkyline data={calendar.days} endDate={calendar.endDate} className="portfolio-skyline" /> : error ? (
        <div role="alert" className="github-status"><p>GitHub activity is temporarily unavailable.</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again</button></div>
      ) : <p className="github-status" role="status">Loading contributions from GitHub…</p>}
      <p className="project-caption">From your public GitHub profile · refreshes hourly{calendar ? ` · through ${calendar.endDate}` : ""}</p>
      <RepositoryLink href="https://github.com/mattdomingo" label="View GitHub Profile" />
    </div>
  );
}
