import { Suspense } from 'react'
import MinecraftNavbar from "@/components/minecraft-navbar"
import PageTransition from "@/components/page-transition"
import { fetchDogOfTheDay, formatDogFacts, type DogData } from '@/lib/fetchDog'

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

async function DogDisplay() {
  let dogData: DogData
  
  try {
    dogData = await fetchDogOfTheDay()
  } catch (error) {
    console.error('Failed to fetch dog data:', error)
    return (
      <div className="error-container minecraft-frame">
        <div className="error-content">
          <h2 className="minecraft-text error-title">🐕 Woof! Something went wrong</h2>
          <p className="minecraft-text error-message">
            The puppy API seems to be napping. Please try again later!
          </p>
          <p className="minecraft-text error-details">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  const facts = formatDogFacts(dogData)

  return (
    <div className="dog-display">
      {/* Dog Image */}
      <div className="dog-image-container">
        <img 
          src={dogData.imageUrl} 
          alt={`Today&apos;s puppy: ${dogData.breedName}`}
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
            {/* Breed ID removed from frontend display as requested */}
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingDog() {
  return (
    <div className="loading-container">
      <div className="dog-image-placeholder minecraft-frame">
        <div className="loading-spinner minecraft-text">
          🐕 Fetching today&apos;s puppy...
        </div>
      </div>
      <div className="dog-facts-placeholder minecraft-frame">
        <div className="minecraft-text">Loading puppy facts...</div>
      </div>
    </div>
  )
}

export default function SecretPage() {
  // The page is accessible to anyone who knows the direct URL
  // No special access control needed - obscurity through URL knowledge
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
              <Suspense fallback={<LoadingDog />}>
                <DogDisplay />
              </Suspense>
            </main>
          </div>
        </div>
      </PageTransition>
    </>
  )
} 