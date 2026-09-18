'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { alertRule, savedRegion } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
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
    db.select().from(savedRegion).where(eq(savedRegion.userId, userId)).orderBy(desc(savedRegion.createdAt)),
    db.select().from(alertRule).where(eq(alertRule.userId, userId)).orderBy(desc(alertRule.createdAt)),
  ])
  return { regions, rules }
}

export async function createRegion(formData: FormData) {
  const userId = await getUserId()
  const name = String(formData.get('name') ?? '').trim()
  const latitude = Number(formData.get('latitude'))
  const longitude = Number(formData.get('longitude'))
  const radiusKm = Number(formData.get('radiusKm'))
  if (!name || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isInteger(radiusKm) || radiusKm < 10 || radiusKm > 2000) throw new Error('Enter a valid region, coordinates, and radius.')
  await db.insert(savedRegion).values({ id: crypto.randomUUID(), userId, name, latitude, longitude, radiusKm })
  revalidatePath('/dashboard')
}

export async function createRule(formData: FormData) {
  const userId = await getUserId()
  const name = String(formData.get('name') ?? '').trim()
  const minMagnitude = Number(formData.get('minMagnitude'))
  if (!name || !Number.isFinite(minMagnitude) || minMagnitude < 0 || minMagnitude > 10) throw new Error('Enter a valid alert rule.')
  await db.insert(alertRule).values({ id: crypto.randomUUID(), userId, name, minMagnitude, enabled: true })
  revalidatePath('/dashboard')
}

export async function deleteRegion(id: string) {
  const userId = await getUserId()
  await db.delete(savedRegion).where(and(eq(savedRegion.id, id), eq(savedRegion.userId, userId)))
  revalidatePath('/dashboard')
}

export async function deleteRule(id: string) {
  const userId = await getUserId()
  await db.delete(alertRule).where(and(eq(alertRule.id, id), eq(alertRule.userId, userId)))
  revalidatePath('/dashboard')
}

export async function toggleRule(id: string, enabled: boolean) {
  const userId = await getUserId()
  await db.update(alertRule).set({ enabled }).where(and(eq(alertRule.id, id), eq(alertRule.userId, userId)))
  revalidatePath('/dashboard')
}

export async function createDefaultWatchlist() {
  const userId = await getUserId()
  const existing = await db.select({ id: savedRegion.id }).from(savedRegion).where(eq(savedRegion.userId, userId))
  if (existing.length === 0) await db.insert(savedRegion).values({ id: crypto.randomUUID(), userId, name: 'My region', latitude: 0, longitude: 0, radiusKm: 100 })
  const rules = await db.select({ id: alertRule.id }).from(alertRule).where(eq(alertRule.userId, userId))
  if (rules.length === 0) await db.insert(alertRule).values({ id: crypto.randomUUID(), userId, name: 'Significant earthquakes', minMagnitude: 5, enabled: true })
  revalidatePath('/dashboard')
}

export type Watchlist = Awaited<ReturnType<typeof getWatchlist>>
