import { NextResponse } from 'next/server'
import { getEarthquakes, syncUSGSEarthquakes } from '@/lib/usgs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await syncUSGSEarthquakes()
    const events = await getEarthquakes()
    return NextResponse.json({ events, source: 'USGS EARTHQUAKE HAZARDS PROGRAM', syncedAt: new Date().toISOString() })
  } catch {
    const events = await getEarthquakes()
    return NextResponse.json({ events, source: 'NEON STORED USGS SNAPSHOT', syncedAt: new Date().toISOString(), stale: true }, { status: events.length ? 200 : 503 })
  }
}
