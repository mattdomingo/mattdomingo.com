import { formatDogFacts, type DogData } from '@/lib/fetchDog'

describe('fetchDog utility functions', () => {
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