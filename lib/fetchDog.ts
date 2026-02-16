interface DogBreed {
  id: number
  name: string
  bred_for?: string
  breed_group?: string
  life_span?: string
  temperament?: string
  weight?: {
    imperial: string
    metric: string
  }
  height?: {
    imperial: string
    metric: string
  }
  reference_image_id?: string
  image?: {
    id: string
    width: number
    height: number
    url: string
  }
  origin?: string
}

export interface DogData {
  id: string
  imageUrl: string
  breedName: string
  breedId?: number
  bredFor?: string
  breedGroup?: string
  lifeSpan?: string
  temperament?: string
  weight?: string
  height?: string
  origin?: string
}

const isDevelopment = process.env.NODE_ENV === 'development'

function debugLog(message: string) {
  if (isDevelopment) {
    console.log(`[DogAPI] ${message}`)
  }
}

// NOTE: Rate limiting is now handled server-side in /api/dog route
// Client-side rate limiting has been removed for security reasons
// See /lib/rateLimit.ts for server-side implementation

export async function fetchDogOfTheDay(): Promise<DogData> {
  const apiKey = process.env.DOG_API_KEY
  
  if (!apiKey) {
    throw new Error('DOG_API_KEY is not configured')
  }

  try {
    // Step 1: Get all breeds (no caching - fresh on every request)
    debugLog('Fetching breeds from Dog API...')
    const breedsResponse = await fetch(
      'https://api.thedogapi.com/v1/breeds',
      {
        headers: {
          'x-api-key': apiKey,
        },
        // No caching - fresh data on every refresh
        cache: 'no-store'
      }
    )

    if (!breedsResponse.ok) {
      throw new Error(`Breeds API request failed with status ${breedsResponse.status}: ${breedsResponse.statusText}`)
    }

    const breeds: DogBreed[] = await breedsResponse.json()
    
    if (!breeds || breeds.length === 0) {
      throw new Error('No breeds data received from API')
    }

    // Step 2: Select a random breed
    const randomIndex = Math.floor(Math.random() * breeds.length)
    const selectedBreed = breeds[randomIndex]
    
    debugLog(`Selected breed: ${selectedBreed.name} (ID: ${selectedBreed.id})`)

    // Step 3: Get an image for this specific breed
    let imageUrl: string | null = null
    let imageId: string | null = null

    // Try to use the reference image first
    if (selectedBreed.image?.url) {
      imageUrl = selectedBreed.image.url
      imageId = selectedBreed.image.id
      debugLog('Using reference image from breed data')
    } else if (selectedBreed.reference_image_id) {
      // If no image object but we have reference_image_id, construct URL
      imageUrl = `https://cdn2.thedogapi.com/images/${selectedBreed.reference_image_id}.jpg`
      imageId = selectedBreed.reference_image_id
      debugLog('Using reference image ID to construct URL')
    } else {
      // Fallback: search for images of this specific breed
      debugLog('Searching for images of this breed...')
      const imageSearchResponse = await fetch(
        `https://api.thedogapi.com/v1/images/search?breed_ids=${selectedBreed.id}&size=med&limit=1`,
        {
          headers: {
            'x-api-key': apiKey,
          },
          cache: 'no-store'
        }
      )

      if (imageSearchResponse.ok) {
        const imageData = await imageSearchResponse.json()
        if (imageData && imageData.length > 0) {
          imageUrl = imageData[0].url
          imageId = imageData[0].id
          debugLog('Found image via breed search')
        }
      }
    }

    // Ensure we have a valid image URL
    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error(`No valid image found for breed: ${selectedBreed.name}`)
    }

    return {
      id: imageId || `breed-${selectedBreed.id}`,
      imageUrl: imageUrl,
      breedName: selectedBreed.name,
      breedId: selectedBreed.id,
      bredFor: selectedBreed.bred_for,
      breedGroup: selectedBreed.breed_group,
      lifeSpan: selectedBreed.life_span,
      temperament: selectedBreed.temperament,
      weight: selectedBreed.weight?.metric,
      height: selectedBreed.height?.metric,
      origin: selectedBreed.origin,
    }

  } catch (error) {
    console.error('Failed to fetch dog data:', error)
    throw error
  }
}

export function formatDogFacts(dog: DogData): Array<{ label: string; value: string }> {
  const facts: Array<{ label: string; value: string }> = []
  
  if (dog.breedName) {
    facts.push({ label: 'Breed', value: dog.breedName })
  }
  
  if (dog.bredFor) {
    facts.push({ label: 'Job', value: dog.bredFor })
  }
  
  // Removed Group field as requested
  
  if (dog.temperament) {
    facts.push({ label: 'Personality', value: dog.temperament })
  }
  
  if (dog.lifeSpan) {
    facts.push({ label: 'Life Span', value: dog.lifeSpan })
  }
  
  if (dog.origin) {
    facts.push({ label: 'Origin', value: dog.origin })
  }
  
  if (dog.weight) {
    facts.push({ label: 'Weight', value: `${dog.weight} kg` })
  }
  
  if (dog.height) {
    facts.push({ label: 'Height', value: `${dog.height} cm` })
  }

  return facts
}

// Helper function to validate API key format
export function validateApiKey(apiKey: string): boolean {
  // Dog API keys are typically UUIDs or long alphanumeric strings
  return Boolean(apiKey && apiKey.length > 10 && /^[a-zA-Z0-9-_]+$/.test(apiKey))
} 