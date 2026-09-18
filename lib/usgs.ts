import { desc } from 'drizzle-orm'
import { db } from './db'
import { earthquakeEvents } from './db/schema'

const USGS_FEED = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

type Feature = { id: string; geometry: { coordinates: [number, number, number] }; properties: Record<string, unknown> }

export async function syncUSGSEarthquakes() {
  const response = await fetch(USGS_FEED, { cache: 'no-store' })
  if (!response.ok) throw new Error(`USGS returned ${response.status}`)
  const payload = await response.json() as { features: Feature[] }
  const rows = payload.features.filter((item) => item.geometry?.coordinates?.length >= 2).map((item) => ({
    id: item.id,
    magnitude: typeof item.properties.mag === 'number' ? item.properties.mag.toFixed(2) : null,
    place: typeof item.properties.place === 'string' ? item.properties.place : 'Unknown location',
    longitude: item.geometry.coordinates[0],
    latitude: item.geometry.coordinates[1],
    depthKm: item.geometry.coordinates[2] ?? null,
    occurredAt: new Date(typeof item.properties.time === 'number' ? item.properties.time : Date.now()),
    eventUrl: typeof item.properties.url === 'string' ? item.properties.url : null,
    rawPayload: item.properties,
    updatedAt: new Date(),
  }))
  for (const row of rows) {
    await db.insert(earthquakeEvents).values(row).onConflictDoUpdate({ target: earthquakeEvents.id, set: { magnitude: row.magnitude, place: row.place, longitude: row.longitude, latitude: row.latitude, depthKm: row.depthKm, occurredAt: row.occurredAt, eventUrl: row.eventUrl, rawPayload: row.rawPayload, updatedAt: new Date() } })
  }
  return rows.length
}

export async function getEarthquakes() {
  return db.select().from(earthquakeEvents).orderBy(desc(earthquakeEvents.occurredAt)).limit(250)
}
