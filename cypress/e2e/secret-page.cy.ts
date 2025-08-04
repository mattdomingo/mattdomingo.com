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
    // Clear localStorage before each test
    cy.clearLocalStorage()
    
    // Stub the Dog API
    cy.intercept('GET', 'https://api.thedogapi.com/v1/breeds', {
      statusCode: 200,
      fixture: 'dog-breeds.json',
    }).as('getDogBreeds')
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
    cy.wait('@getDogBreeds')
    
    // Check that the dog image is displayed
    cy.get('img[alt*="Today\'s puppy"]').should('be.visible')

    // Check that puppy facts are displayed
    cy.contains('🐾 Puppy Facts').should('be.visible')
    cy.contains('Breed:').should('be.visible')
    cy.contains('Personality:').should('be.visible')

    // Check that rate limit info is displayed
    cy.contains('puppy requests remaining today').should('be.visible')

    // Check that refresh hint is displayed
    cy.contains('🔄 Refresh the page to see a new puppy!').should('be.visible')
  })

  it('should display loading state initially', () => {
    // Make the API call slow to see loading state
    cy.intercept('GET', 'https://api.thedogapi.com/v1/breeds', {
      statusCode: 200,
      fixture: 'dog-breeds.json',
      delay: 2000
    }).as('getSlowDogBreeds')

    cy.visit('/secret')

    // Check loading spinner appears
    cy.contains('🐕 Fetching today\'s puppy...').should('be.visible')
    cy.contains('Loading puppy facts...').should('be.visible')

    // Wait for API call to complete
    cy.wait('@getSlowDogBreeds')

    // Loading should disappear and content should appear
    cy.contains('🐕 Fetching today\'s puppy...').should('not.exist')
    cy.get('img[alt*="Today\'s puppy"]').should('be.visible')
  })

  it('should display error message when API fails', () => {
    // Stub API to return error
    cy.intercept('GET', 'https://api.thedogapi.com/v1/breeds', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getErrorDogBreeds')

    cy.visit('/secret')

    cy.wait('@getErrorDogBreeds')

    // Check error message is displayed
    cy.contains('🐕 Woof! Something went wrong').should('be.visible')
    cy.contains('The puppy API seems to be napping').should('be.visible')
  })

  it('should track rate limiting and show remaining requests', () => {
    cy.visit('/secret')
    cy.wait('@getDogBreeds')

    // Should show initial rate limit (99 remaining after first request)
    cy.contains('99 puppy requests remaining today').should('be.visible')

    // Refresh the page to make another request
    cy.reload()
    cy.wait('@getDogBreeds')

    // Should show decremented count
    cy.contains('98 puppy requests remaining today').should('be.visible')
  })

  it('should display rate limit exceeded message when limit is reached', () => {
    // Set localStorage to simulate 100 requests already made
    cy.window().then((win) => {
      const today = new Date().toDateString()
      win.localStorage.setItem('dogPageRequests', JSON.stringify({
        date: today,
        count: 100
      }))
    })

    cy.visit('/secret')

    // Should show rate limit exceeded message
    cy.contains('🐕 Woof! Daily limit reached').should('be.visible')
    cy.contains('You\'ve reached your daily limit of 100 puppy requests').should('be.visible')
    cy.contains('Requests remaining: 0').should('be.visible')
    cy.contains('Limit resets:').should('be.visible')

    // Should not make API call when rate limited
    cy.get('@getDogBreeds.all').should('have.length', 0)
  })

  it('should reset rate limit for a new day', () => {
    // Set localStorage to simulate yesterday's data
    cy.window().then((win) => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      win.localStorage.setItem('dogPageRequests', JSON.stringify({
        date: yesterday.toDateString(),
        count: 100
      }))
    })

    cy.visit('/secret')
    cy.wait('@getDogBreeds')

    // Should work normally for new day
    cy.contains('99 puppy requests remaining today').should('be.visible')
    cy.get('img[alt*="Today\'s puppy"]').should('be.visible')
  })

  it('should have responsive image that scales on hover', () => {
    cy.visit('/secret')
    cy.wait('@getDogBreeds')

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

  it('should fetch new data on each refresh (no caching)', () => {
    // Visit page first time
    cy.visit('/secret')
    cy.wait('@getDogBreeds')
    
    // Get the first image src
    cy.get('img[alt*="Today\'s puppy"]').then(($img1) => {
      const firstImageSrc = $img1.attr('src')
      
      // Refresh the page
      cy.reload()
      cy.wait('@getDogBreeds')
      
      // The API should be called again (proving no caching)
      cy.get('@getDogBreeds.all').should('have.length', 2)
      
      // Rate limit should decrease
      cy.contains('98 puppy requests remaining today').should('be.visible')
    })
  })
})

// Test for URL-based access
describe('Secret Page URL Access', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.intercept('GET', 'https://api.thedogapi.com/v1/breeds', {
      statusCode: 200,
      fixture: 'dog-breeds.json',
    }).as('getDogBreeds')
  })

  it('should be accessible to anyone who knows the direct URL', () => {
    // The secret is knowing that /secret exists - no other protection needed
    cy.visit('/secret')
    
    // Should load successfully for anyone with the URL
    cy.contains('Puppy On Demand').should('be.visible')
    cy.get('body').should('exist')
  })
}) 