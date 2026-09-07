'use client'

import { useEffect, useRef } from 'react'
import { useExperience } from './experience-provider'

export function ProjectVideo({ src, poster, title, ambient = false }: { src: string; poster: string; title: string; ambient?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const { reducedMotion } = useExperience()
  useEffect(() => {
    const video = ref.current
    if (!video || !ambient) return
    if (reducedMotion) { video.pause(); return }
    let inView = false
    const update = () => {
      if (inView && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update() }, { threshold: .3 })
    observer.observe(video)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); video.pause() }
  }, [ambient, reducedMotion])
  return <video ref={ref} className="project-video" controls={!ambient || reducedMotion} muted loop={ambient} playsInline preload="none" poster={poster} aria-label={title}>
    <source src={src} type="video/webm" /><source src={src.replace('.webm', '.mp4')} type="video/mp4" />
    <a href={src}>Download the {title} video</a>
  </video>
}
