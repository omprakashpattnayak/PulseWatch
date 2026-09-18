import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

type Feature = {
  id: string
  geometry?: { coordinates?: [number, number, number] }
  properties?: { mag?: number | null; place?: string | null; time?: number | null; url?: string | null }
}

function scoreEvent(magnitude: number, depthKm: number, occurredAt: number) {
  const recency = Math.max(0, 1 - (Date.now() - occurredAt) / 86_400_000)
  const magnitudeScore = Math.min(70, Math.max(0, magnitude * 14))
  const shallowScore = Math.max(0, 20 - Math.min(20, depthKm / 5))
  return Math.round(Math.min(100, magnitudeScore + shallowScore + recency * 10))
}

export async function GET() {
  const startedAt = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)

  try {
    const response = await fetch(USGS_URL, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { accept: 'application/geo+json, application/json' },
    })
    if (!response.ok) throw new Error(`USGS returned ${response.status}`)
    const payload = await response.json() as { features?: Feature[] }
    const events = (payload.features ?? []).flatMap((feature) => {
      const coordinates = feature.geometry?.coordinates
      if (!feature.id || !coordinates || coordinates.length < 2) return []
      const magnitude = Number(feature.properties?.mag ?? 0)
      const occurredAt = Number(feature.properties?.time ?? Date.now())
      const depthKm = Number(coordinates[2] ?? 0)
      const score = scoreEvent(magnitude, depthKm, occurredAt)
      return [{
        id: feature.id,
        type: 'earthquake' as const,
        title: feature.properties?.place ?? 'Unknown location',
        location: feature.properties?.place ?? 'Unknown location',
        coordinates: [coordinates[1], coordinates[0]] as [number, number],
        severity: score >= 70 ? 'High' as const : score >= 40 ? 'Moderate' as const : 'Low' as const,
        magnitude: `M ${magnitude.toFixed(1)}`,
        source: 'USGS REAL-TIME',
        description: `${new Date(occurredAt).toLocaleString()} · Depth ${Math.round(depthKm)} km`,
        url: feature.properties?.url ?? undefined,
        timestamp: occurredAt,
        score,
      }]
    })

    return NextResponse.json({
      events,
      source: 'USGS EARTHQUAKE HAZARDS PROGRAM',
      sourceHealth: { status: 'healthy', latencyMs: Date.now() - startedAt, fetchedAt: new Date().toISOString() },
      scoring: 'Informational score based on magnitude, depth, and recency. Not a prediction or emergency warning.',
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({
      events: [],
      source: 'USGS EARTHQUAKE HAZARDS PROGRAM',
      sourceHealth: { status: 'unavailable', latencyMs: Date.now() - startedAt, fetchedAt: new Date().toISOString() },
      error: error instanceof Error && error.name === 'AbortError' ? 'USGS request timed out' : 'USGS feed unavailable',
    }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
  } finally {
    clearTimeout(timeout)
  }
}
