'use client'

import { useTransition } from 'react'
import { signOut } from '@/lib/auth-client'
import { createDefaultWatchlist } from '@/app/actions/watchlist'
import { useRouter } from 'next/navigation'

type Watchlist = { regions: { id: string; name: string; radiusKm: number }[]; rules: { id: string; name: string; minMagnitude: number; enabled: boolean }[] }

export function DashboardClient({ user, watchlist }: { user: { name: string; email: string }; watchlist: Watchlist }) {
  const router = useRouter(); const [pending, startTransition] = useTransition()
  return <main className="dashboard-page"><header className="dashboard-header"><div><p className="eyebrow">PULSEWATCH / CONTROL ROOM</p><h1>Your watchlist.</h1><p>Signed in as {user.email}</p></div><button type="button" onClick={async () => { await signOut(); router.push('/'); router.refresh() }}>Sign out</button></header><section className="dashboard-grid"><article className="dashboard-card"><p className="eyebrow">SAVED REGIONS</p><h2>{watchlist.regions.length}</h2><p>{watchlist.regions.length ? watchlist.regions.map((region) => `${region.name} · ${region.radiusKm} km`).join(', ') : 'Save a region to monitor nearby events.'}</p><button type="button" disabled={pending} onClick={() => startTransition(async () => { await createDefaultWatchlist(); router.refresh() })}>{pending ? 'Saving…' : 'Add a region'}</button></article><article className="dashboard-card"><p className="eyebrow">ALERT RULES</p><h2>{watchlist.rules.length}</h2><p>{watchlist.rules.length ? watchlist.rules.map((rule) => `${rule.name} · M ${rule.minMagnitude}+`).join(', ') : 'Create an alert rule for significant earthquakes.'}</p><button type="button" disabled={pending} onClick={() => startTransition(async () => { await createDefaultWatchlist(); router.refresh() })}>{pending ? 'Saving…' : 'Create an alert rule'}</button></article></section></main>
}
