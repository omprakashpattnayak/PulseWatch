import { NextResponse } from 'next/server'

export const revalidate = 300

export async function GET() {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', {
      next: { revalidate: 300 },
      headers: { Accept: 'application/geo+json' },
    })
    if (!response.ok) return NextResponse.json({ error: 'USGS feed unavailable' }, { status: 502 })
    const payload = await response.json()
    const events = payload.features.map((item: { id: string; geometry?: { coordinates?: [number, number, number] }; properties: Record<string, unknown> }) => ({
      id: `usgs-${item.id}`,
      type: 'earthquake' as const,
      title: String(item.properties.title ?? 'Earthquake'),
      location: String(item.properties.place ?? 'Unknown location'),
      coordinates: [item.geometry?.coordinates?.[1] ?? 0, item.geometry?.coordinates?.[0] ?? 0] as [number, number],
      severity: Number(item.properties.mag ?? 0) >= 5 ? 'High' as const : 'Moderate' as const,
      magnitude: `M ${Number(item.properties.mag ?? 0).toFixed(1)}`,
      source: 'USGS',
      description: `Live USGS event observed ${new Date(Number(item.properties.time ?? Date.now())).toLocaleString()}. Open the official event page for depth, status, and scientific details.`,
      url: String(item.properties.url ?? 'https://earthquake.usgs.gov/earthquakes/feed/'),
      timestamp: Number(item.properties.time ?? Date.now()),
    }))
    return NextResponse.json({ events, fetchedAt: new Date().toISOString(), source: 'USGS Earthquake Hazards Program' })
  } catch {
    return NextResponse.json({ error: 'Unable to reach USGS' }, { status: 502 })
  }
}
