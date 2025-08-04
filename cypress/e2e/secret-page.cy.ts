describe('Secret Puppy Page', () => {
  const mockDogResponse = [
    {
      id: 'cypress-test-123',
      url: 'https://images.dog.ceo/breeds/golden/test.jpg',
      width: 800,
      height: 600,
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
  ]

  beforeEach(() => {
    // Stub the Dog API
    cy.intercept('GET', 'https://api.thedogapi.com/v1/images/search*', {
      statusCode: 200,
      body: mockDogResponse,
    }).as('getDogImage')
  })

  it('should display the secret page with puppy content when accessed directly via URL', () => {
    // Visit the secret page directly - accessible to anyone who knows the URL
    cy.visit('/secret')

    // Check that the page loads with proper title
    cy.contains('Puppy On Demand').should('be.visible')
    
    // Check that today's date is displayed
    cy.get('[class*="secret-date"]').should('be.visible')
    cy.get('[class*="secret-date"]').should('contain.text', new Date().getFullYear().toString())

    // Wait for API call and check that dog content loads
    cy.wait('@getDogImage')
    
    // Check that the dog image is displayed
    cy.get('img[alt*="Today\'s puppy"]').should('be.visible')
    cy.get('img[alt*="Today\'s puppy"]').should('have.attr', 'src', mockDogResponse[0].url)

    // Check that puppy facts are displayed
    cy.contains('🐾 Puppy Facts').should('be.visible')
    cy.contains('Breed:').should('be.visible')
    cy.contains('Golden Retriever').should('be.visible')
    cy.contains('Personality:').should('be.visible')
    cy.contains('Friendly, Intelligent, Devoted').should('be.visible')
  })

  it('should display loading state initially', () => {
    // Make the API call slow to see loading state
    cy.intercept('GET', 'https://api.thedogapi.com/v1/images/search*', {
      statusCode: 200,
      body: mockDogResponse,
      delay: 2000
    }).as('getSlowDogImage')

    cy.visit('/secret')

    // Check loading spinner appears
    cy.contains('🐕 Fetching today\'s puppy...').should('be.visible')
    cy.contains('Loading puppy facts...').should('be.visible')

    // Wait for API call to complete
    cy.wait('@getSlowDogImage')

    // Loading should disappear and content should appear
    cy.contains('🐕 Fetching today\'s puppy...').should('not.exist')
    cy.get('img[alt*="Today\'s puppy"]').should('be.visible')
  })

  it('should display error message when API fails', () => {
    // Stub API to return error
    cy.intercept('GET', 'https://api.thedogapi.com/v1/images/search*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getErrorDogImage')

    cy.visit('/secret')

    cy.wait('@getErrorDogImage')

    // Check error message is displayed
    cy.contains('🐕 Woof! Something went wrong').should('be.visible')
    cy.contains('The puppy API seems to be napping').should('be.visible')
  })

  it('should handle API response with no breed information', () => {
    const noBreedsResponse = [
      {
        id: 'no-breeds-123',
        url: 'https://images.dog.ceo/breeds/mixed/test.jpg',
        width: 600,
        height: 800,
        breeds: []
      }
    ]

    cy.intercept('GET', 'https://api.thedogapi.com/v1/images/search*', {
      statusCode: 200,
      body: noBreedsResponse,
    }).as('getNoBreedsImage')

    cy.visit('/secret')

    cy.wait('@getNoBreedsImage')

    // Should still display image
    cy.get('img[alt*="Today\'s puppy"]').should('be.visible')
    
    // Should show "Unknown mystery pup" since no breed data
    cy.contains('Unknown mystery pup').should('be.visible')
  })

  it('should have responsive image that scales on hover', () => {
    cy.visit('/secret')
    cy.wait('@getDogImage')

    // Check image is present
    cy.get('img[alt*="Today\'s puppy"]').should('be.visible')

    // Test hover effect (check CSS property)
    cy.get('[class*="dog-image-container"]').trigger('mouseover')
    cy.get('[class*="dog-image-container"]').should('have.css', 'transition')
  })

  it('should display minecraft-themed navigation', () => {
    cy.visit('/secret')

    // Check that minecraft navbar is present
    cy.get('[class*="minecraft-navbar"]').should('be.visible')
    cy.contains('MATT DOMINGO').should('be.visible')
    
    // Check navigation items
    cy.contains('HOME').should('be.visible')
    cy.contains('PROJECTS').should('be.visible')
    cy.contains('CONTACT').should('be.visible')
  })
})

// Test for URL-based access
describe('Secret Page URL Access', () => {
  it('should be accessible to anyone who knows the direct URL', () => {
    // The secret is knowing that /secret exists - no other protection needed
    cy.visit('/secret')
    
    // Should load successfully for anyone with the URL
    cy.contains('Puppy On Demand').should('be.visible')
    cy.get('body').should('exist')
  })
}) 