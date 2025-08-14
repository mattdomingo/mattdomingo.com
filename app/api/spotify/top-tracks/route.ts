import { NextRequest, NextResponse } from 'next/server'
import { getTopTracks, errorResponse } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const timeRangeParam = searchParams.get('time_range') as 'short_term' | 'medium_term' | 'long_term' | null
    const limit = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam, 10))) : 5
    const timeRange = timeRangeParam || 'short_term'

    const tracks = await getTopTracks(limit, timeRange)
    return NextResponse.json({ tracks })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load top tracks'
    return errorResponse(message)
  }
}


