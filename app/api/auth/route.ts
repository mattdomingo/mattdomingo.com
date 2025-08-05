import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Secret credentials from environment variables
const SECRET_NAME = process.env.SECRET_NAME
const SECRET_MESSAGE = process.env.SECRET_MESSAGE

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, message } = body

    // Check credentials (case insensitive)
    if (SECRET_NAME && SECRET_MESSAGE &&
        name.toLowerCase().trim() === SECRET_NAME.toLowerCase() && 
        message.toLowerCase().trim() === SECRET_MESSAGE.toLowerCase()) {
      
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