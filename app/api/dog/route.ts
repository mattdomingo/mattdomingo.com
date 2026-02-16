import { NextRequest, NextResponse } from 'next/server'
import { fetchDogOfTheDay } from '@/lib/fetchDog'
import { rateLimit, addRateLimitHeaders } from '@/lib/rateLimit'

// Rate limit: 100 requests per day per IP
const RATE_LIMIT_CONFIG = {
  maxRequests: 100,
  windowMs: 24 * 60 * 60 * 1000 // 24 hours
}

export async function GET(request: NextRequest) {
  try {
    // Apply server-side rate limiting
    const rateLimitResult = rateLimit(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    // Fetch dog data
    const dogData = await fetchDogOfTheDay()
    
    // Return response with rate limit headers
    const response = NextResponse.json(dogData)
    return addRateLimitHeaders(response, rateLimitResult)
  } catch (error) {
    console.error('API route error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch dog data' 
      },
      { status: 500 }
    )
  }
} 