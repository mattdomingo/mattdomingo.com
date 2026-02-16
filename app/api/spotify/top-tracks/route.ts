import { NextRequest, NextResponse } from 'next/server'
import { getTopTracks, errorResponse } from '@/lib/spotify'
import { rateLimit, addRateLimitHeaders } from '@/lib/rateLimit'
import { validateNumberInRange, sanitizeUrlParam } from '@/lib/validation'

// Rate limit: 60 requests per minute
const RATE_LIMIT_CONFIG = {
  maxRequests: 60,
  windowMs: 60 * 1000 // 1 minute
}

const ALLOWED_TIME_RANGES = ['short_term', 'medium_term', 'long_term']

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const timeRangeParam = searchParams.get('time_range')

    // Validate and sanitize limit parameter (1-50)
    const limit = limitParam 
      ? validateNumberInRange(limitParam, 1, 50) ?? 5
      : 5

    // Validate and sanitize time_range parameter
    const timeRange = sanitizeUrlParam(timeRangeParam, ALLOWED_TIME_RANGES) || 'short_term'

    const tracks = await getTopTracks(limit, timeRange as 'short_term' | 'medium_term' | 'long_term')
    const response = NextResponse.json({ tracks })
    return addRateLimitHeaders(response, rateLimitResult)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load top tracks'
    return errorResponse(message)
  }
}


