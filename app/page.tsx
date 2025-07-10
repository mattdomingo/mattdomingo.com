'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [lookingForWorkText, setLookingForWorkText] = useState("")

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

  useEffect(() => {
    const randomPhrase = lookingForWorkPhrases[Math.floor(Math.random() * lookingForWorkPhrases.length)]
    setLookingForWorkText(randomPhrase)
  }, [])

  return (
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
        <a href="/about" className="minecraft-button">ABOUT ME</a>
        <a href="/projects" className="minecraft-button">MY PROJECTS</a>
        <a href="/contact" className="minecraft-button">CONTACT</a>
      </div>
    </div>
  )
}
