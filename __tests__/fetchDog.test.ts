import { formatDogFacts, checkRateLimit, type DogData } from '@/lib/fetchDog'

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('fetchDog utility functions', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('formatDogFacts', () => {
    it('should format all available dog facts correctly', () => {
      const mockDogData: DogData = {
        id: 'test-id',
        imageUrl: 'https://example.com/dog.jpg',
        breedName: 'Golden Retriever',
        bredFor: 'Retrieving game',
        breedGroup: 'Sporting',
        lifeSpan: '10 - 12 years',
        temperament: 'Friendly, Intelligent, Devoted',
        weight: '25 - 34',
        height: '51 - 61',
        origin: 'Scotland'
      }

      const facts = formatDogFacts(mockDogData)

      expect(facts).toEqual([
        { label: 'Breed', value: 'Golden Retriever' },
        { label: 'Job', value: 'Retrieving game' },
        { label: 'Personality', value: 'Friendly, Intelligent, Devoted' },
        { label: 'Life Span', value: '10 - 12 years' },
        { label: 'Origin', value: 'Scotland' },
        { label: 'Weight', value: '25 - 34 kg' },
        { label: 'Height', value: '51 - 61 cm' }
      ])
    })

    it('should handle minimal dog data with only breed name', () => {
      const mockDogData: DogData = {
        id: 'test-id',
        imageUrl: 'https://example.com/dog.jpg',
        breedName: 'Unknown mystery pup'
      }

      const facts = formatDogFacts(mockDogData)

      expect(facts).toEqual([
        { label: 'Breed', value: 'Unknown mystery pup' }
      ])
    })

    it('should handle dog data with some missing fields', () => {
      const mockDogData: DogData = {
        id: 'test-id',
        imageUrl: 'https://example.com/dog.jpg',
        breedName: 'Beagle',
        temperament: 'Gentle, Even Tempered, Determined',
        lifeSpan: '12 - 15 years'
      }

      const facts = formatDogFacts(mockDogData)

      expect(facts).toEqual([
        { label: 'Breed', value: 'Beagle' },
        { label: 'Personality', value: 'Gentle, Even Tempered, Determined' },
        { label: 'Life Span', value: '12 - 15 years' }
      ])
    })

    it('should return empty array when no breed name is provided', () => {
      const mockDogData: DogData = {
        id: 'test-id',
        imageUrl: 'https://example.com/dog.jpg',
        breedName: ''
      }

      const facts = formatDogFacts(mockDogData)

      expect(facts).toEqual([])
    })

    it('should properly format weight and height with units', () => {
      const mockDogData: DogData = {
        id: 'test-id',
        imageUrl: 'https://example.com/dog.jpg',
        breedName: 'Test Breed',
        weight: '10 - 15',
        height: '25 - 30'
      }

      const facts = formatDogFacts(mockDogData)

      expect(facts).toContainEqual({ label: 'Weight', value: '10 - 15 kg' })
      expect(facts).toContainEqual({ label: 'Height', value: '25 - 30 cm' })
    })
  })

  describe('checkRateLimit', () => {
    it('should allow requests when no prior requests exist', () => {
      const result = checkRateLimit()
      
      expect(result.allowed).toBe(true)
      expect(result.remainingRequests).toBe(99) // 100 - 1 (current request)
      expect(result.resetTime).toBeTruthy()
    })

    it('should track request count correctly', () => {
      // First request
      const result1 = checkRateLimit()
      expect(result1.allowed).toBe(true)
      expect(result1.remainingRequests).toBe(99)

      // Second request
      const result2 = checkRateLimit()
      expect(result2.allowed).toBe(true)
      expect(result2.remainingRequests).toBe(98)
    })

    it('should block requests after reaching daily limit', () => {
      // Mock localStorage to simulate 100 requests already made
      const today = new Date().toDateString()
      localStorageMock.setItem('dogPageRequests', JSON.stringify({
        date: today,
        count: 100
      }))

      const result = checkRateLimit()
      
      expect(result.allowed).toBe(false)
      expect(result.remainingRequests).toBe(0)
    })

    it('should reset count for a new day', () => {
      // Mock localStorage with yesterday's data
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      localStorageMock.setItem('dogPageRequests', JSON.stringify({
        date: yesterday.toDateString(),
        count: 100
      }))

      const result = checkRateLimit()
      
      expect(result.allowed).toBe(true)
      expect(result.remainingRequests).toBe(99)
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.setItem('dogPageRequests', 'invalid-json')

      const result = checkRateLimit()
      
      expect(result.allowed).toBe(true)
      expect(result.remainingRequests).toBe(99)
    })
  })
})

// Test utilities for mocking API responses
export const mockDogApiResponse = {
  successful: [
    {
      id: 'test-123',
      url: 'https://cdn2.thedogapi.com/images/test-123.jpg',
      width: 1080,
      height: 1080,
      breeds: [
        {
          id: 1,
          name: 'Golden Retriever',
          bred_for: 'Retrieving game',
          breed_group: 'Sporting',
          life_span: '10 - 12 years',
          temperament: 'Friendly, Intelligent, Devoted',
          weight: {
            imperial: '55 - 75',
            metric: '25 - 34'
          },
          height: {
            imperial: '20 - 24',
            metric: '51 - 61'
          }
        }
      ]
    }
  ],
  noBreeds: [
    {
      id: 'test-456',
      url: 'https://cdn2.thedogapi.com/images/test-456.jpg',
      width: 800,
      height: 600,
      breeds: []
    }
  ],
  empty: []
} 