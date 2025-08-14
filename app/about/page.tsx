'use client'

import { useState, useEffect, useRef } from 'react'
import SkillsInventory from "@/components/skills-inventory"
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"

type MiniTrack = {
  name: string
  artistNames: string
  albumName: string
  albumImageUrl: string | null
  url: string
}

export default function AboutPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [lastPlayed, setLastPlayed] = useState<MiniTrack | null>(null)

  const scrollToSection = (sectionIndex: number) => {
    const container = containerRef.current
    const section = container?.querySelector(`#section-${sectionIndex}`) as HTMLElement | null
    if (container && section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setCurrentSection(sectionIndex)
    }
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleScroll = () => {
      const newSection = Math.round(el.scrollTop / el.clientHeight)
      setCurrentSection(newSection)
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadLastPlayed() {
      try {
        const res = await fetch('/api/spotify/now-playing', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const t = data?.track
        if (!t) return
        const mini: MiniTrack = {
          name: t.name ?? 'Unknown',
          artistNames: t.artistNames ?? 'Unknown',
          albumName: t.albumName ?? 'Unknown',
          albumImageUrl: t.albumImageUrl ?? null,
          url: t.url ?? '#'
        }
        if (!cancelled) setLastPlayed(mini)
      } catch {
        // ignore network errors
      }
    }
    loadLastPlayed()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <MinecraftNavbar />
      <PageTransition>
        <div ref={containerRef} className="fullpage-container page-with-navbar">
        {/* Section 1: Character Stats */}
        <section id="section-0" className="fullpage-section character-stats-section">
        <div className="character-stats-container">
          <h1 className="minecraft-text character-stats-title">CHARACTER STATS</h1>
          
          <div className="character-layout">
            {/* Left side - Profile */}
            <div className="character-profile">
              <div className="profile-frame">
                <div className="profile-image-border">
                  <img
                    src="/profile.png"
                    alt="Matt Domingo profile picture"
                    className="profile-image"
                  />
                </div>
              </div>
              <div className="profile-info">
                <h2 className="minecraft-text profile-name">MATT DOMINGO</h2>
                <p className="minecraft-text profile-level">CS @ UW-Madison</p>
                {lastPlayed && (
                  <div className="last-played-mini">
                    <div className="mini-title minecraft-text">Last Played</div>
                    <a className="mini-row" href={lastPlayed.url} target="_blank" rel="noreferrer">
                      {lastPlayed.albumImageUrl && (
                        <img className="mini-image" src={lastPlayed.albumImageUrl} alt={`Album art for ${lastPlayed.albumName}`} />
                      )}
                      <div className="mini-info">
                        <div className="mini-track minecraft-text">{lastPlayed.name}</div>
                        <div className="mini-artist">{lastPlayed.artistNames}</div>
                        <div className="mini-album">{lastPlayed.albumName}</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Description and Achievements */}
            <div className="character-details">
              <div className="character-description">
                <p>I&apos;m a passionate software engineer with a love for problem solving. Just like in Minecraft, I enjoy building things block by block, turning ideas into reality.</p>
                <br />
                <p>When I&apos;m not coding, you can find me making videos, DJing, or trying to figure out my golf swing!</p>
              </div>

              <div className="achievements">
                <div className="achievement-box">
                  <h4 className="achievement-title">ACHIEVEMENT UNLOCKED</h4>
                  <p className="achievement-text">Bachelor&apos;s in Computer Science</p>
                  <p className="achievement-text">Minors in Mathematics, Economics, and Statistics</p>
                </div>
                <div className="achievement-box">
                  <h4 className="achievement-title">ACHIEVEMENT UNLOCKED</h4>
                  <p className="achievement-text">Intern @ Magnet-Schultz of America</p>
                  <p className="achievement-text">Intern @ Pharus.ai</p>
                  <p className="achievement-text">Intern @ TruStage</p>
                  <p className="achievement-text">AI Analyst @ DataAnnotation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>
      {/* Down Arrow */}
      {currentSection === 0 && (
        <button 
          className="scroll-arrow scroll-arrow-down"
          onClick={() => scrollToSection(1)}
          aria-label="Scroll to Skills"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Section 2: Skills Inventory */}
      <section id="section-1" className="fullpage-section skills-section">
        <div className="skills-section-container">
          <SkillsInventory />
        </div>

        {/* Up Arrow */}
        {currentSection === 1 && (
          <button 
            className="scroll-arrow scroll-arrow-up"
            onClick={() => scrollToSection(0)}
            aria-label="Scroll to Character Stats"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 14l-5-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        </section>
        </div>
      </PageTransition>
    </>
  )
}