'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { createRegion, createRule, deleteRegion, deleteRule, toggleRule, type Watchlist } from '@/app/actions/watchlist'

function ActionForm({ type, onSubmit, pending }: { type: 'region' | 'rule'; onSubmit: (event: FormEvent<HTMLFormElement>) => void; pending: boolean }) {
  return <form className="dashboard-form" onSubmit={onSubmit}>
    <label>Name<input name="name" required placeholder={type === 'region' ? 'e.g. Manila' : 'e.g. Major earthquakes'} /></label>
    {type === 'region' ? <div className="form-row"><label>Latitude<input name="latitude" type="number" step="any" min="-90" max="90" required placeholder="14.60" /></label><label>Longitude<input name="longitude" type="number" step="any" min="-180" max="180" required placeholder="120.98" /></label></div> : <label>Minimum magnitude<input name="minMagnitude" type="number" step="0.1" min="0" max="10" defaultValue="5" required /></label>}
    {type === 'region' && <label>Radius in km<input name="radiusKm" type="number" min="10" max="2000" defaultValue="100" required /></label>}
    <button type="submit" disabled={pending}>{pending ? 'Saving…' : type === 'region' ? 'Save region' : 'Save rule'}</button>
  </form>
}

export function DashboardClient({ user, watchlist }: { user: { name: string; email: string }; watchlist: Watchlist }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [notice, setNotice] = useState('')
  function submit(action: (formData: FormData) => Promise<void>, event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setNotice('')
    startTransition(async () => { try { await action(new FormData(event.currentTarget)); event.currentTarget.reset(); setNotice('Saved.'); router.refresh() } catch { setNotice('Could not save that item. Check the values and try again.') } })
  }
  return <main className="dashboard-page"><header className="dashboard-header"><div><p className="eyebrow">PULSEWATCH / CONTROL ROOM</p><h1>Your watchlist.</h1><p>Signed in as {user.email}. Monitor places and define the signal that matters.</p></div><button type="button" onClick={async () => { await signOut(); router.push('/'); router.refresh() }}>Sign out</button></header>
    {notice && <p className="dashboard-notice" role="status">{notice}</p>}
    <section className="dashboard-grid">
      <article className="dashboard-card"><p className="eyebrow">SAVED REGIONS · {watchlist.regions.length}</p><h2>{watchlist.regions.length}</h2><p>{watchlist.regions.length ? 'Your monitored locations appear below.' : 'Save a region to monitor nearby events.'}</p><ActionForm type="region" pending={pending} onSubmit={(event) => submit(createRegion, event)} />{watchlist.regions.map((region) => <div className="dashboard-item" key={region.id}><span><strong>{region.name}</strong><small>{region.latitude.toFixed(2)}, {region.longitude.toFixed(2)} · {region.radiusKm} km radius</small></span><button type="button" onClick={() => startTransition(async () => { await deleteRegion(region.id); router.refresh() })}>Remove</button></div>)}</article>
      <article className="dashboard-card"><p className="eyebrow">ALERT RULES · {watchlist.rules.length}</p><h2>{watchlist.rules.length}</h2><p>{watchlist.rules.length ? 'Rules are ready for the alert delivery layer.' : 'Create an alert rule for significant earthquakes.'}</p><ActionForm type="rule" pending={pending} onSubmit={(event) => submit(createRule, event)} />{watchlist.rules.map((rule) => <div className="dashboard-item" key={rule.id}><span><strong>{rule.name}</strong><small>M {rule.minMagnitude}+ · {rule.enabled ? 'Enabled' : 'Paused'}</small></span><span className="dashboard-actions"><button type="button" onClick={() => startTransition(async () => { await toggleRule(rule.id, !rule.enabled); router.refresh() })}>{rule.enabled ? 'Pause' : 'Enable'}</button><button type="button" onClick={() => startTransition(async () => { await deleteRule(rule.id); router.refresh() })}>Remove</button></span></div>)}</article>
    </section>
  </main>
}
