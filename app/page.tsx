'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageTransition from '@/components/page-transition'
import LoadingScreen from '@/components/loading-screen'

export default function HomePage() {
  const [lookingForWorkText, setLookingForWorkText] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const lookingForWorkPhrases = [
      "Also try... hiring me!",
      "Also try... hiring me!",
      "Also try... hiring me!",
      "Also try... hiring me!",
      "Also try... hiring me!",
      "Looking for opportunities!",
      "Open to new roles!",
      "Seeking employment!",
      "Available for work!",
      "Ready to contribute!",
      "Exploring opportunities!",
      "Open for business!",
      "Actively job hunting!",
      "Ready for challenges!",
      "Seeking new adventures!",
      "Available for hire!"
    ]
    
    const randomPhrase = lookingForWorkPhrases[Math.floor(Math.random() * lookingForWorkPhrases.length)]
    setLookingForWorkText(randomPhrase)
  }, [])

  useEffect(() => {
    const img = new Image()
    img.src = '/textures/landing1.gif'
    img.onload = () => {
      // Add a small delay to ensure the loading screen is visible for at least a moment
      // and to let the "building terrain" vibe sink in
      setTimeout(() => setIsLoading(false), 800)
    }
    // Fallback in case image load fails or hangs
    img.onerror = () => setIsLoading(false)
  }, [])

  if (isLoading) return <LoadingScreen />

  return (
    <PageTransition>
      <div className="landing-page">
        {/* Yellow pulsing text */}
        {lookingForWorkText && (
          <div className="minecraft-splash-text">
            {lookingForWorkText}
          </div>
        )}
        
        <h1 className="minecraft-text title">MATT DOMINGO</h1>
        <h2 className="minecraft-text subtitle">SOFTWARE ENGINEER</h2>
        
        <div className="minecraft-chat-box">
          <p>Welcome to my world! I craft digital experiences with code.</p>
        </div>

        <div className="button-container">
          <Link href="/about" className="minecraft-button">ABOUT ME</Link>
          <Link href="/projects" className="minecraft-button">MY PROJECTS</Link>
          <Link href="/contact" className="minecraft-button">CONTACT</Link>
        </div>
      </div>
    </PageTransition>
  )
}
