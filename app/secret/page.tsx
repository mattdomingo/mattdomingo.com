'use client'
import { Suspense, useEffect, useState } from 'react'
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"
import { formatDogFacts, checkRateLimit, type DogData, type RateLimitResult } from '@/lib/fetchDog'

function formatTodaysDate(): string {
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })
  return formatter.format(today)
}

function RateLimitExceeded({ rateLimitInfo }: { rateLimitInfo: RateLimitResult }) {
  return (
    <div className="error-container minecraft-frame">
      <div className="error-content">
        <h2 className="minecraft-text error-title">🐕 Woof! Daily limit reached</h2>
        <p className="minecraft-text error-message">
          You've reached your daily limit of 100 puppy requests! Come back tomorrow for more adorable dogs.
        </p>
        <div className="minecraft-text error-details">
          <p>Requests remaining: {rateLimitInfo.remainingRequests}</p>
          <p>Limit resets: {rateLimitInfo.resetTime}</p>
        </div>
      </div>
    </div>
  )
}

function DogDisplay() {
  const [dogData, setDogData] = useState<DogData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitResult | null>(null)

  useEffect(() => {
    async function loadDogData() {
      try {
        setLoading(true)
        setError(null)

        // Check rate limit first
        const limitCheck = checkRateLimit()
        setRateLimitInfo(limitCheck)

        if (!limitCheck.allowed) {
          setLoading(false)
          return
        }

        // Call our API route instead of fetchDogOfTheDay directly
        const response = await fetch('/api/dog', {
          cache: 'no-store' // Ensure fresh data on each request
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch dog data')
        }

        const data = await response.json()
        setDogData(data)
      } catch (err) {
        console.error('Failed to fetch dog data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadDogData()
  }, []) // Empty dependency array - only runs once on mount, but new data on each refresh

  if (loading) {
    return <LoadingDog />
  }

  if (rateLimitInfo && !rateLimitInfo.allowed) {
    return <RateLimitExceeded rateLimitInfo={rateLimitInfo} />
  }

  if (error) {
    return (
      <div className="error-container minecraft-frame">
        <div className="error-content">
          <h2 className="minecraft-text error-title">🐕 Woof! Something went wrong</h2>
          <p className="minecraft-text error-message">
            The puppy API seems to be napping. Please try again later!
          </p>
          <p className="minecraft-text error-details">
            Error: {error}
          </p>
        </div>
      </div>
    )
  }

  if (!dogData) {
    return <LoadingDog />
  }

  const facts = formatDogFacts(dogData)

  return (
    <div className="dog-display">
      {/* Rate limit info */}
      {rateLimitInfo && (
        <div className="rate-limit-info minecraft-frame" style={{ 
          background: 'rgba(0, 0, 0, 0.7)', 
          padding: '10px 20px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p className="minecraft-text" style={{ color: '#ffd700', margin: 0, fontSize: '14px' }}>
            🐾 {rateLimitInfo.remainingRequests} puppy requests remaining today
          </p>
        </div>
      )}

      {/* Dog Image */}
      <div className="dog-image-container">
        <img 
          src={dogData.imageUrl} 
          alt={`Today's puppy: ${dogData.breedName}`}
          className="dog-image"
          loading="eager"
        />
      </div>

      {/* Dog Facts Card */}
      {facts.length > 0 && (
        <div className="dog-facts-card minecraft-frame">
          <h3 className="minecraft-text facts-title">🐾 Puppy Facts</h3>
          <div className="facts-list">
            {facts.map((fact, index) => (
              <div key={index} className="fact-item">
                <span className="fact-label minecraft-text">{fact.label}:</span>
                <span className="fact-value minecraft-text">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh hint */}
      <div className="refresh-hint minecraft-frame" style={{ 
        background: 'rgba(139, 69, 19, 0.8)', 
        padding: '15px', 
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <p className="minecraft-text" style={{ color: '#ffffff', margin: 0, fontSize: '14px' }}>
          🔄 Refresh the page to see a new puppy!
        </p>
      </div>
    </div>
  )
}

function LoadingDog() {
  return (
    <div className="loading-container">
      <div className="dog-image-placeholder minecraft-frame">
        <div className="loading-spinner minecraft-text">
          🐕 Fetching today's puppy...
        </div>
      </div>
      <div className="dog-facts-placeholder minecraft-frame">
        <div className="minecraft-text">Loading puppy facts...</div>
      </div>
    </div>
  )
}

export default function SecretPage() {
  const todaysDate = formatTodaysDate()

  return (
    <>
      <MinecraftNavbar />
      <PageTransition>
        <div className="secret-page page-with-navbar">
          <div className="secret-container">
            {/* Header */}
            <header className="secret-header">
              <h1 className="secret-title minecraft-text">Puppy On Demand</h1>
              <p className="secret-date minecraft-text">{todaysDate}</p>
            </header>

            {/* Dog Content */}
            <main className="secret-main">
              <DogDisplay />
            </main>
          </div>
        </div>
      </PageTransition>
    </>
  )
} 