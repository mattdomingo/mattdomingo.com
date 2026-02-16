import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// Note: In production, use Redis or a database for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 60 * 1000) // 1 hour

export interface RateLimitConfig {
  maxRequests: number // Maximum number of requests
  windowMs: number    // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate limit a request based on IP address or identifier
 * @param request - The Next.js request object
 * @param config - Rate limit configuration
 * @param identifier - Optional custom identifier (defaults to IP address)
 * @returns Rate limit result or NextResponse if rate limit exceeded
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): RateLimitResult | NextResponse {
  const now = Date.now()
  
  // Get identifier (IP address or custom identifier)
  const key = identifier || getClientIdentifier(request)
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs
    }
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)
  
  // Check if rate limit exceeded
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
          'Retry-After': retryAfter.toString()
        }
      }
    )
  }
  
  // Return success with rate limit info
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetTime
  }
}

/**
 * Get client identifier from request (IP address)
 * Falls back to 'unknown' if IP is not available
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (proxies, load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  // Fallback for local development or when IP is not available
  // In production (Vercel, etc.), one of the headers above should be present
  return 'unknown'
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
  
  return response
}
