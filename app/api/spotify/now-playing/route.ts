import { NextRequest, NextResponse } from 'next/server'
import { getLastPlayedTrack, errorResponse } from '@/lib/spotify'
import { rateLimit, addRateLimitHeaders } from '@/lib/rateLimit'

// Rate limit: 60 requests per minute
const RATE_LIMIT_CONFIG = {
  maxRequests: 60,
  windowMs: 60 * 1000 // 1 minute
}

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    const data = await getLastPlayedTrack()
    const response = NextResponse.json(data)
    return addRateLimitHeaders(response, rateLimitResult)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load last played track'
    return errorResponse(message)
  }
}


