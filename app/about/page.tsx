'use client'

import { useState, useEffect } from 'react'
import SkillsInventory from "@/components/skills-inventory"
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"

export default function AboutPage() {
  const [currentSection, setCurrentSection] = useState(0)

  const scrollToSection = (sectionIndex: number) => {
    const section = document.getElementById(`section-${sectionIndex}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setCurrentSection(sectionIndex)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const newSection = Math.round(scrollY / windowHeight)
      setCurrentSection(newSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <MinecraftNavbar />
      <PageTransition>
        <div className="fullpage-container page-with-navbar">
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