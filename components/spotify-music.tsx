"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Music2 } from "lucide-react";

type Track = {
  id?: string;
  name: string;
  artistNames: string;
  albumName: string;
  url: string;
};
const isTrack = (track: Track | null): track is Track =>
  Boolean(
    track &&
    typeof track.url === "string" &&
    track.url.startsWith("https://open.spotify.com/"),
  );

export default function SpotifyMusic() {
  const [track, setTrack] = useState<Track | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    async function get(url: string) {
      try {
        const response = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        return response.ok ? await response.json() : null;
      } catch {
        return null;
      }
    }
    let active = true;
    async function load() {
      const [recent, top] = await Promise.all([
        get("/api/spotify/now-playing"),
        get("/api/spotify/top-tracks?limit=5&time_range=short_term"),
      ]);
      if (!active) return;
      if (isTrack(recent?.track)) setTrack(recent.track);
      if (Array.isArray(top?.tracks)) setTopTracks(top.tracks.filter(isTrack));
      setLoading(false);
      clearTimeout(timeout);
    }
    load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
  return (
    <div className="listening-card">
      <Music2 size={22} />
      <div>
        <span className="mono">ON THE ROTATION / SPOTIFY</span>
        {loading ? (
          <p role="status">Loading recent listening…</p>
        ) : track ? (
          <a href={track.url} target="_blank" rel="noreferrer">
            <strong>{track.name}</strong>
            <span>
              {track.artistNames} · {track.albumName}
            </span>
            <ArrowUpRight size={18} />
          </a>
        ) : (
          <p>Recent listening is unavailable right now.</p>
        )}
        {topTracks.length > 0 && (
          <details className="top-tracks">
            <summary>Top tracks · last four weeks</summary>
            <ol>
              {topTracks.map((item, index) => (
                <li key={item.id || index}>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <strong>{item.name}</strong>
                    <span>{item.artistNames}</span>
                  </a>
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </div>
  );
}
