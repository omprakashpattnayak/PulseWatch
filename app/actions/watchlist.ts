'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { alertRule, savedRegion } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getWatchlist() {
  const userId = await getUserId()
  const [regions, rules] = await Promise.all([
    db.select().from(savedRegion).where(eq(savedRegion.userId, userId)),
    db.select().from(alertRule).where(eq(alertRule.userId, userId)),
  ])
  return { regions, rules }
}

export async function createDefaultWatchlist() {
  const userId = await getUserId()
  const existing = await db.select({ id: savedRegion.id }).from(savedRegion).where(eq(savedRegion.userId, userId))
  if (existing.length === 0) await db.insert(savedRegion).values({ id: crypto.randomUUID(), userId, name: 'My region', latitude: 0, longitude: 0, radiusKm: 100 })
  const rules = await db.select({ id: alertRule.id }).from(alertRule).where(eq(alertRule.userId, userId))
  if (rules.length === 0) await db.insert(alertRule).values({ id: crypto.randomUUID(), userId, name: 'Significant earthquakes', minMagnitude: 5, enabled: true })
  revalidatePath('/dashboard')
}
