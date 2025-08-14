import { NextResponse } from 'next/server'
import { getLastPlayedTrack, errorResponse } from '@/lib/spotify'

export async function GET() {
  try {
    const data = await getLastPlayedTrack()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load last played track'
    return errorResponse(message)
  }
}


