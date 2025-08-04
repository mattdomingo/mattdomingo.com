import { NextRequest, NextResponse } from 'next/server'
import { fetchDogOfTheDay, checkRateLimit } from '@/lib/fetchDog'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting will be handled on the client side since it uses localStorage
    const dogData = await fetchDogOfTheDay()
    
    return NextResponse.json(dogData)
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