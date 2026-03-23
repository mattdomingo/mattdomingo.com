import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { sanitizeString } from '@/lib/validation'

/** Legacy easter-egg check: same env vars as before, but no session cookie or /secret page. */
const SECRET_NAME = process.env.SECRET_NAME
const SECRET_MESSAGE = process.env.SECRET_MESSAGE

const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { name, message } = body

    if (typeof name !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid input format' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeString(name, 100)
    const sanitizedMessage = sanitizeString(message, 500)

    const secretName = SECRET_NAME?.trim()
    const secretMessage = SECRET_MESSAGE?.trim()

    if (
      secretName &&
      secretMessage &&
      sanitizedName.toLowerCase() === secretName.toLowerCase() &&
      sanitizedMessage.toLowerCase() === secretMessage.toLowerCase()
    ) {
      return NextResponse.json({
        success: true,
        message: 'This feature is no longer available.',
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, message: 'Request failed' },
      { status: 500 }
    )
  }
}
