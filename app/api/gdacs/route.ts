import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GDACS_RSS_URL = 'https://www.gdacs.org/contentdata/xml/rss_24h.xml'

type FeedItem = { title?: string; link?: string; description?: string; pubDate?: string; guid?: string; geoLat?: string; geoLong?: string }

function textBetween(source: string, tag: string) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() ?? ''
}

function parseItems(xml: string): FeedItem[] {
  return [...xml.matchAll(new RegExp('<item[\\s\\S]*?<\\/item>', 'gi'))].map((match) => {
    const item = match[0]
    return { title: textBetween(item, 'title'), link: textBetween(item, 'link'), description: textBetween(item, 'description'), pubDate: textBetween(item, 'pubDate'), guid: textBetween(item, 'guid'), geoLat: textBetween(item, 'geo:lat'), geoLong: textBetween(item, 'geo:long') }
  })
}

function classify(title: string, description: string) {
  const value = `${title} ${description}`.toLowerCase()
  if (value.includes('cyclone') || value.includes('storm') || value.includes('hurricane')) return 'Tropical cyclone'
  if (value.includes('flood')) return 'Flood'
  if (value.includes('drought')) return 'Drought'
  if (value.includes('earthquake')) return 'Earthquake'
  return 'Natural hazard'
}

export async function GET() {
  const startedAt = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(GDACS_RSS_URL, { signal: controller.signal, cache: 'no-store', headers: { accept: 'application/rss+xml, application/xml, text/xml' } })
    if (!response.ok) throw new Error(`GDACS returned ${response.status}`)
    const items = parseItems(await response.text())
    const events = items.flatMap((item, index) => {
      const coordinates = [Number(item.geoLat), Number(item.geoLong)] as [number, number]
      if (!Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) return []
      const title = item.title || 'GDACS alert'
      const hazard = classify(title, item.description || '')
      const timestamp = Date.parse(item.pubDate || '') || Date.now()
      return [{ id: `gdacs-${item.guid || index}`, type: 'climate' as const, title, location: hazard, coordinates, severity: 'High' as const, magnitude: 'GDACS alert', source: 'GDACS REAL-TIME', description: `${item.description || 'Official global disaster alert'} · ${new Date(timestamp).toLocaleString()}`, url: item.link || 'https://www.gdacs.org/', timestamp, score: 70 }]
    })
    return NextResponse.json({ events, source: 'GDACS 24-HOUR ALERT FEED', sourceHealth: { status: 'healthy', latencyMs: Date.now() - startedAt, fetchedAt: new Date().toISOString() } }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ events: [], source: 'GDACS 24-HOUR ALERT FEED', sourceHealth: { status: 'unavailable', latencyMs: Date.now() - startedAt }, error: error instanceof Error && error.name === 'AbortError' ? 'GDACS request timed out' : 'GDACS feed unavailable' }, { status: 502 })
  } finally { clearTimeout(timeout) }
}
