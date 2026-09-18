'use client'

import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { createRegion, createRule, deleteRegion, deleteRule, toggleRule, type Watchlist } from '@/app/actions/watchlist'

type Hazard = { id: string; type: 'earthquake' | 'wildfire'; title: string; location: string; coordinates: [number, number]; severity: string; magnitude: string; source: string; timestamp?: number }
type FeedResponse = { events?: Hazard[] }
const fetcher = (url: string) => fetch(url).then((response) => response.ok ? response.json() as Promise<FeedResponse> : Promise.reject(new Error('Feed unavailable')))

function distanceKm(from: [number, number], to: [number, number]) {
  const earthRadius = 6371
  const radians = (value: number) => value * Math.PI / 180
  const dLat = radians(to[0] - from[0])
  const dLon = radians(to[1] - from[1])
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(from[0])) * Math.cos(radians(to[0])) * Math.sin(dLon / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function ActionForm({ type, onSubmit, pending, position = null, onLocate }: { type: 'region' | 'rule'; onSubmit: (event: FormEvent<HTMLFormElement>) => void; pending: boolean; position?: [number, number] | null; onLocate?: () => void }) {
  return <form className="dashboard-form" onSubmit={onSubmit}>
    <label>Name<input name="name" required placeholder={type === 'region' ? 'e.g. Manila' : 'e.g. Major earthquakes'} /></label>
    {type === 'region' ? <><div className="form-row"><label>Latitude<input name="latitude" type="number" step="any" min="-90" max="90" required placeholder="14.60" defaultValue={position?.[0] ?? ''} /></label><label>Longitude<input name="longitude" type="number" step="any" min="-180" max="180" required placeholder="120.98" defaultValue={position?.[1] ?? ''} /></label></div><button className="secondary-action" type="button" onClick={onLocate} disabled={!onLocate}>Use my current location</button></> : <label>Minimum magnitude<input name="minMagnitude" type="number" step="0.1" min="0" max="10" defaultValue="5" required /></label>}
    {type === 'region' && <label>Radius in km<input name="radiusKm" type="number" min="10" max="2000" defaultValue="100" required /></label>}
    <button type="submit" disabled={pending}>{pending ? 'Saving…' : type === 'region' ? 'Save region' : 'Save rule'}</button>
  </form>
}

export function DashboardClient({ user, watchlist }: { user: { name: string; email: string }; watchlist: Watchlist }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [notice, setNotice] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'ready' | 'denied'>('idle')
  const { data: earthquakes } = useSWR<FeedResponse>('/api/earthquakes', fetcher, { refreshInterval: 300000 })
  const { data: wildfires } = useSWR<FeedResponse>('/api/wildfires', fetcher, { refreshInterval: 300000 })

  function locateMe() {
    if (!navigator.geolocation) { setLocationState('denied'); return }
    setLocationState('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setUserLocation([coords.latitude, coords.longitude]); setLocationState('ready') },
      () => setLocationState('denied'),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    )
  }

  useEffect(() => { locateMe() }, [])

  const nearest = useMemo(() => {
    if (!userLocation) return null
    return [...(earthquakes?.events ?? []), ...(wildfires?.events ?? [])]
      .filter((hazard) => hazard.coordinates?.length === 2)
      .map((hazard) => ({ hazard, distance: distanceKm(userLocation, hazard.coordinates) }))
      .sort((a, b) => a.distance - b.distance)[0] ?? null
  }, [userLocation, earthquakes, wildfires])

  function submit(action: (formData: FormData) => Promise<void>, event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setNotice('')
    const form = event.currentTarget
    startTransition(async () => { try { await action(new FormData(form)); form.reset(); setNotice('Saved.'); router.refresh() } catch { setNotice('Could not save that item. Check the values and try again.') } })
  }

  const nearestIsImmediate = nearest !== null && nearest.distance < 100
  const hazardTypeLabel = nearest?.hazard.type === 'wildfire' ? 'Wildfire' : 'Earthquake'

  return <main className="dashboard-page"><header className="dashboard-header"><div><a className="dashboard-back-link" href="/">← Back to PulseWatch home</a><p className="eyebrow">PULSEWATCH / CONTROL ROOM</p><h1>Your watchlist.</h1><p>Signed in as {user.email}. Monitor places and define the signal that matters.</p></div><div className="dashboard-header-actions"><a className="dashboard-contact-link" href="/#contact">Let&apos;s connect</a><button type="button" onClick={async () => { await signOut(); window.location.assign('/') }}>Sign out</button></div></header>
    <section className={`closest-hazard-card ${nearest ? `hazard-${nearest.hazard.type}` : ''}`} aria-live="polite">
      <div className="closest-hazard-content"><p className="eyebrow">CLOSEST ACTIVE HAZARD ALERT</p><div className="closest-hazard-heading"><span className="hazard-type-label">{nearest && <span className="hazard-type-mark" aria-hidden="true">{nearest.hazard.type === 'wildfire' ? 'FIRE' : 'SEISMIC'}</span>}{hazardTypeLabel}</span>{nearest && <span className={`hazard-status-badge ${nearestIsImmediate ? 'immediate' : 'monitor'}`}>{nearestIsImmediate ? 'Immediate Proximity' : 'Monitor Distance'}</span>}</div><h2>{nearest ? nearest.hazard.title : locationState === 'loading' ? 'Finding your location…' : locationState === 'denied' ? 'Location access unavailable' : 'Waiting for live feeds…'}</h2><p>{nearest ? `Nearest threat is ${nearest.distance < 1 ? '<1' : Math.round(nearest.distance).toLocaleString()} km away from you · ${nearest.hazard.location}` : locationState === 'denied' ? 'Allow location access to calculate distance to active earthquakes and wildfire detections.' : 'We compare your location with current USGS earthquakes and NASA FIRMS fire detections.'}</p></div><button type="button" onClick={locateMe} disabled={locationState === 'loading'}>{locationState === 'ready' ? 'Update location' : 'Use my location'}</button>
    </section>
    {notice && <p className="dashboard-notice" role="status">{notice}</p>}
    <section className="dashboard-grid">
      <article className="dashboard-card"><p className="eyebrow">SAVED REGIONS · {watchlist.regions.length}</p><h2>{watchlist.regions.length}</h2><p>{watchlist.regions.length ? 'Your monitored locations appear below.' : 'Save a region to monitor nearby events.'}</p><ActionForm type="region" pending={pending} position={userLocation} onLocate={locateMe} onSubmit={(event) => submit(createRegion, event)} />{watchlist.regions.map((region) => <div className="dashboard-item" key={region.id}><span><strong>{region.name}</strong><small>{region.latitude.toFixed(2)}, {region.longitude.toFixed(2)} · {region.radiusKm} km radius</small></span><button type="button" onClick={() => startTransition(async () => { await deleteRegion(region.id); router.refresh() })}>Remove</button></div>)}</article>
      <article className="dashboard-card"><p className="eyebrow">ALERT RULES · {watchlist.rules.length}</p><h2>{watchlist.rules.length}</h2><p>{watchlist.rules.length ? 'Rules are ready for the alert delivery layer.' : 'Create an alert rule for significant earthquakes.'}</p><ActionForm type="rule" pending={pending} onSubmit={(event) => submit(createRule, event)} />{watchlist.rules.map((rule) => <div className="dashboard-item" key={rule.id}><span><strong>{rule.name}</strong><small>M {rule.minMagnitude}+ · {rule.enabled ? 'Enabled' : 'Paused'}</small></span><span className="dashboard-actions"><button type="button" onClick={() => startTransition(async () => { await toggleRule(rule.id, !rule.enabled); router.refresh() })}>{rule.enabled ? 'Pause' : 'Enable'}</button><button type="button" onClick={() => startTransition(async () => { await deleteRule(rule.id); router.refresh() })}>Remove</button></span></div>)}</article>
    </section>
  </main>
}
