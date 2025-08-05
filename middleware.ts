import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to the secret route
  if (request.nextUrl.pathname === '/secret') {
    const sessionToken = request.cookies.get('secret_session')
    
    if (!sessionToken) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/secret'
} 