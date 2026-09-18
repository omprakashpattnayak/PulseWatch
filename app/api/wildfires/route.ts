import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FIRMS_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv'

type FireRow = { latitude?: string; longitude?: string; acq_date?: string; acq_time?: string; confidence?: string; bright_ti4?: string; frp?: string; satellite?: string }

function parseCsv(text: string): FireRow[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((header) => header.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ''])) as FireRow
  })
}

export async function GET() {
  const startedAt = Date.now()
  const mapKey = process.env.NASA_FIRMS_MAP_KEY
  if (!mapKey) return NextResponse.json({ events: [], source: 'NASA FIRMS', sourceHealth: { status: 'unconfigured' } }, { status: 503 })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(`${FIRMS_URL}/${encodeURIComponent(mapKey)}/VIIRS_SNPP_NRT/world/1`, { signal: controller.signal, cache: 'no-store', headers: { accept: 'text/csv' } })
    if (!response.ok) throw new Error(`NASA FIRMS returned ${response.status}`)
    const rows = parseCsv(await response.text())
    // FIRMS can return tens of thousands of detections for a global day. Keep the interactive map responsive while preserving the newest records.
    const events = rows.slice(-500).flatMap((row, index) => {
      const latitude = Number(row.latitude)
      const longitude = Number(row.longitude)
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return []
      const frp = Number(row.frp ?? 0)
      const timestamp = Date.parse(`${row.acq_date ?? ''}T${(row.acq_time ?? '0000').padStart(4, '0').slice(0, 2)}:${(row.acq_time ?? '0000').padStart(4, '0').slice(2)}:00Z`) || Date.now()
      const confidence = row.confidence ?? 'nominal'
      const score = Math.round(Math.min(100, Math.max(10, frp / 4 + (confidence === 'high' ? 25 : confidence === 'nominal' ? 15 : 5))))
      return [{ id: `firms-${row.acq_date}-${row.acq_time}-${latitude}-${longitude}-${index}`, type: 'wildfire' as const, title: 'NASA FIRMS thermal detection', location: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`, coordinates: [latitude, longitude] as [number, number], severity: score >= 70 ? 'High' as const : 'Moderate' as const, magnitude: `${frp.toFixed(1)} MW FRP`, source: 'NASA FIRMS REAL-TIME', description: `${row.acq_date ?? 'Unknown date'} · ${confidence} confidence · ${row.satellite ?? 'satellite detection'}`, timestamp, score }]
    })
    return NextResponse.json({ events, source: 'NASA FIRMS VIIRS SNPP NRT', sourceHealth: { status: 'healthy', latencyMs: Date.now() - startedAt, fetchedAt: new Date().toISOString() }, scoring: 'Informational detection score based on fire radiative power and source confidence. A thermal detection is not a confirmed fire or damage assessment.' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ events: [], source: 'NASA FIRMS VIIRS SNPP NRT', sourceHealth: { status: 'unavailable', latencyMs: Date.now() - startedAt }, error: error instanceof Error && error.name === 'AbortError' ? 'NASA FIRMS request timed out' : 'NASA FIRMS feed unavailable' }, { status: 502 })
  } finally { clearTimeout(timeout) }
}
