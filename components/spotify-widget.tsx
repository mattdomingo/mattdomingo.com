'use client'

import { useEffect, useState } from 'react'
import { Disc3, X } from 'lucide-react'
import SpotifyMusic from '@/components/spotify-music'

type SpotifyWidgetProps = {
  variant?: 'floating' | 'navbar'
}

export default function SpotifyWidget({ variant = 'floating' }: SpotifyWidgetProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      {variant === 'floating' ? (
        <button
          aria-label="Open Spotify info"
          className="music-disc-button"
          onClick={() => setOpen(true)}
        >
          <Disc3 className="music-disc-icon" />
        </button>
      ) : (
        <button
          aria-label="Open Spotify info"
          className="navbar-icon-plain"
          onClick={() => setOpen(true)}
          type="button"
        >
          <img src="/textures/disk.png" alt="Music" className="navbar-item-icon-img" />
        </button>
      )}

      {open && (
        <>
          <button
            type="button"
            className="spotify-overlay"
            aria-label="Close Spotify popup"
            onClick={() => setOpen(false)}
          />
          <dialog open className="spotify-popup">
            <button aria-label="Close" className="popup-close-fab" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
            <div className="spotify-popup-body">
              <SpotifyMusic />
            </div>
          </dialog>
        </>
      )}
    </>
  )
}


