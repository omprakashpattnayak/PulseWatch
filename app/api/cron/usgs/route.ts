import { NextResponse } from 'next/server'
import { syncUSGSEarthquakes } from '@/lib/usgs'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authorization !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse('Unauthorized', { status: 401 })
  const count = await syncUSGSEarthquakes()
  return NextResponse.json({ ok: true, synced: count, syncedAt: new Date().toISOString() })
}
