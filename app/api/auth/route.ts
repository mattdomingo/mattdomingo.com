import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { rateLimit } from '@/lib/rateLimit'
import { sanitizeString } from '@/lib/validation'

// Secret credentials from environment variables
const SECRET_NAME = process.env.SECRET_NAME
const SECRET_MESSAGE = process.env.SECRET_MESSAGE

// Rate limit: 5 attempts per 15 minutes
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000 // 15 minutes
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, RATE_LIMIT_CONFIG)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    // Parse and validate request body
    const body = await request.json()
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { name, message } = body

    // Validate input types and sanitize
    if (typeof name !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid input format' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeString(name, 100)
    const sanitizedMessage = sanitizeString(message, 500)

    // Check credentials (case insensitive)
    if (SECRET_NAME && SECRET_MESSAGE &&
        sanitizedName.toLowerCase() === SECRET_NAME.toLowerCase() && 
        sanitizedMessage.toLowerCase() === SECRET_MESSAGE.toLowerCase()) {
      
      // Generate a secure session token
      const sessionToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      
      // Set HTTP-only cookie with the session token
      const response = NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      })
      
      response.cookies.set('secret_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: expiresAt,
        path: '/'
      })
      
      return response
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('secret_session')
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false })
    }
    
    // In a real app, you'd validate the token against a database
    // For simplicity, we'll just check if it exists and is not expired
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.delete('secret_session')
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    )
  }
} 