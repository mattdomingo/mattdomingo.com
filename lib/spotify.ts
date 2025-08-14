import { NextResponse } from 'next/server'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

type SimplifiedTrack = {
  id: string
  name: string
  artistNames: string
  albumName: string
  albumImageUrl: string | null
  url: string
  previewUrl: string | null
  durationMs: number
}

function assertEnv() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Missing Spotify environment variables. Please set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN.')
  }
}

async function getAccessToken(): Promise<string> {
  assertEnv()

  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: SPOTIFY_REFRESH_TOKEN as string
  })

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  const tokenJson = await tokenResponse.json()
  if (!tokenResponse.ok) {
    throw new Error(`Failed to refresh Spotify access token: ${tokenJson?.error || tokenResponse.statusText}`)
  }

  return tokenJson.access_token as string
}

async function spotifyFetch<T>(endpoint: string): Promise<T> {
  const accessToken = await getAccessToken()
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    cache: 'no-store'
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Spotify API error: ${response.status} ${response.statusText} ${errorText}`)
  }

  return response.json() as Promise<T>
}

function mapTrack(track: any): SimplifiedTrack {
  const image = Array.isArray(track?.album?.images) && track.album.images.length > 0
    ? (track.album.images[1] || track.album.images[0])
    : null

  return {
    id: track?.id ?? '',
    name: track?.name ?? 'Unknown',
    artistNames: Array.isArray(track?.artists) ? track.artists.map((a: any) => a.name).join(', ') : 'Unknown',
    albumName: track?.album?.name ?? 'Unknown',
    albumImageUrl: image?.url ?? null,
    url: track?.external_urls?.spotify ?? '#',
    previewUrl: track?.preview_url ?? null,
    durationMs: track?.duration_ms ?? 0
  }
}

export async function getLastPlayedTrack(): Promise<{ track: SimplifiedTrack | null, playedAt?: string }> {
  type RecentlyPlayedResponse = {
    items: Array<{
      track: any,
      played_at: string
    }>
  }

  const data = await spotifyFetch<RecentlyPlayedResponse>('https://api.spotify.com/v1/me/player/recently-played?limit=1')
  const lastItem = data.items?.[0]
  if (!lastItem?.track) {
    return { track: null }
  }

  return { track: mapTrack(lastItem.track), playedAt: lastItem.played_at }
}

export async function getTopTracks(limit: number = 5, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term'): Promise<SimplifiedTrack[]> {
  type TopTracksResponse = {
    items: any[]
  }

  const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`
  const data = await spotifyFetch<TopTracksResponse>(url)
  return (data.items || []).map(mapTrack)
}

// Small helper to format errors consistently in API routes
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}


