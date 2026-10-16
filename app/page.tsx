'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import PageTransition from '@/components/page-transition'
import LoadingScreen from '@/components/loading-screen'

export default function HomePage() {
  const [lookingForWorkText, setLookingForWorkText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const landingPageRef = useRef<HTMLDivElement>(null)

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
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/textures/landing1.gif', true)
    xhr.responseType = 'blob'

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100
        setLoadingProgress(progress)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response
        const url = URL.createObjectURL(blob)
        
        // Set the CSS variable on the document root or the specific element
        // We use the document root so ::before pseudo-element can pick it up
        document.documentElement.style.setProperty('--landing-bg', `url(${url})`)
        
        setLoadingProgress(100)
        
        // Slight delay to let 100% sink in
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      } else {
        // Fallback if load fails
        setIsLoading(false)
      }
    }

    xhr.onerror = () => {
      setIsLoading(false)
    }

    xhr.send()

    return () => {
      xhr.abort()
      // We don't revoke the object URL immediately as it's needed for the page
      // It will be cleaned up on page refresh
    }
  }, [])

  if (isLoading) return <LoadingScreen progress={loadingProgress} />

  return (
    <PageTransition>
      <div className="landing-page" ref={landingPageRef}>
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
