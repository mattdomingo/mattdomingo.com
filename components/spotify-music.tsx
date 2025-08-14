'use client'

import { useEffect, useState } from 'react'

type Track = {
  id: string
  name: string
  artistNames: string
  albumName: string
  albumImageUrl: string | null
  url: string
  previewUrl: string | null
  durationMs: number
}

export default function SpotifyMusic() {
  const [lastPlayed, setLastPlayed] = useState<{ track: Track | null, playedAt?: string } | null>(null)
  const [topTracks, setTopTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [nowRes, topRes] = await Promise.all([
          fetch('/api/spotify/now-playing', { cache: 'no-store' }),
          fetch('/api/spotify/top-tracks?limit=5&time_range=short_term', { cache: 'no-store' })
        ])
        if (!nowRes.ok) throw new Error('Failed to fetch last played track')
        if (!topRes.ok) throw new Error('Failed to fetch top tracks')

        const nowJson = await nowRes.json()
        const topJson = await topRes.json()

        if (!cancelled) {
          setLastPlayed(nowJson)
          setTopTracks(topJson.tracks || [])
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Something went wrong')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="music-section">
      <h3 className="music-title minecraft-text">WHAT I'M LISTENING TO</h3>
      <div className="music-stack">
        <div className="music-card">
          <h4 className="music-card-title">Last Played</h4>
          {loading ? (
            <div className="music-loading">Loading...</div>
          ) : error ? (
            <div className="music-error">{error}</div>
          ) : lastPlayed?.track ? (
            <a className="track-row last-played-row" href={lastPlayed.track.url} target="_blank" rel="noreferrer">
              {lastPlayed.track.albumImageUrl && (
                <img className="track-image" src={lastPlayed.track.albumImageUrl} alt={`Album art for ${lastPlayed.track.albumName}`} />
              )}
              <div className="track-info">
                <div className="track-name minecraft-text">{lastPlayed.track.name}</div>
                <div className="track-artist">{lastPlayed.track.artistNames}</div>
                <div className="track-album">{lastPlayed.track.albumName}</div>
              </div>
            </a>
          ) : (
            <div className="music-empty">No recent playback found</div>
          )}
        </div>

        <div className="music-card">
          <h4 className="music-card-title">Top Tracks (last 4 weeks)</h4>
          {loading ? (
            <div className="music-loading">Loading...</div>
          ) : error ? (
            <div className="music-error">{error}</div>
          ) : (
            <ul className="top-tracks-list">
              {topTracks.map((t, idx) => (
                <li key={t.id} className="top-track-item">
                  <a className="track-row" href={t.url} target="_blank" rel="noreferrer">
                    <span className="track-rank">{idx + 1}.</span>
                    {t.albumImageUrl && (
                      <img className="track-image small" src={t.albumImageUrl} alt={`Album art for ${t.albumName}`} />
                    )}
                    <div className="track-info">
                      <div className="track-name small">{t.name}</div>
                      <div className="track-artist">{t.artistNames}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}


