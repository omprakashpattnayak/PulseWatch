'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { Activity, ArrowDown, ArrowRight, ArrowUpRight, Crosshair, Flame, Globe2, Layers3, Radio, ShieldCheck, Waves, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { demoEvents, eventCategories, type DemoEvent, type EventType } from '@/lib/demo-events'
import { cn } from '@/lib/utils'

const CrisisMap = dynamic(() => import('@/components/crisis-map'), {
  ssr: false,
  loading: () => <div className="map-loading"><Globe2 aria-hidden="true" /><span>Preparing global view</span></div>,
})
const categoryIcons = { earthquake: Activity, wildfire: Flame, climate: Waves }
const allCategories: EventType[] = ['earthquake', 'wildfire', 'climate']
type USGSFeature = { id: string; geometry: { coordinates: [number, number, number] }; properties: { mag: number | null; place: string | null; time: number | null; url: string | null; title: string | null } }
type USGSResponse = { features: USGSFeature[] }

async function fetchUSGS(url: string): Promise<{ events: DemoEvent[]; source: string }> {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('USGS feed unavailable')
  const payload = await response.json() as { events: DemoEvent[]; source: string }
  return payload
}

export function Hero() {
  const [exploring, setExploring] = useState(false)
  const [categories, setCategories] = useState<EventType[]>(allCategories)
  const [selected, setSelected] = useState<DemoEvent | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])
  const { data, error, isLoading, mutate } = useSWR<{ events: DemoEvent[]; source: string }>('/api/earthquakes', fetchUSGS, { refreshInterval: 300000, revalidateOnFocus: false, keepPreviousData: true })
  const { data: wildfireData, error: wildfireError, mutate: mutateWildfire } = useSWR<{ events: DemoEvent[]; source: string }>('/api/wildfires', fetchUSGS, { refreshInterval: 300000, revalidateOnFocus: false, keepPreviousData: true })
  const { data: gdacsData, error: gdacsError, mutate: mutateGdacs } = useSWR<{ events: DemoEvent[]; source: string }>('/api/gdacs', fetchUSGS, { refreshInterval: 300000, revalidateOnFocus: false, keepPreviousData: true })
  const liveEvents = hasMounted ? (data?.events ?? []) : []
  const wildfireEvents = hasMounted ? (wildfireData?.events ?? []) : []
  const gdacsEvents = hasMounted ? (gdacsData?.events ?? []) : []
  const events = liveEvents.length > 0 || wildfireEvents.length > 0 || gdacsEvents.length > 0 ? [...liveEvents, ...wildfireEvents, ...gdacsEvents] : demoEvents.filter((event) => event.type === 'earthquake')
  const visibleEvents = events.filter((event) => categories.includes(event.type))
  const activeSelected = selected
  const SelectedIcon = activeSelected ? categoryIcons[activeSelected.type] : Activity

  function changeCategories(values: string[]) {
    const next = values.filter((value): value is EventType => allCategories.includes(value as EventType))
    setCategories(next)
    if (selected && !next.includes(selected.type)) {
      setSelected(null)
      setShowDetails(false)
    }
  }

  function selectEvent(event: DemoEvent) {
    setSelected(event)
    setShowDetails(false)
  }

  return (
    <>
      <section className={cn('hero', exploring && 'is-exploring')} id="map" aria-labelledby="hero-title">
        <div className="hero-map-layer"><CrisisMap events={events} categories={categories} selectedId={activeSelected?.id ?? null} onSelect={selectEvent} exploring={exploring} /></div>
        <div className="hero-map-shade" aria-hidden="true" />
        <div className="page-width hero-inner">
          <div className="hero-topline">
            <div className="eyebrow competition-label"><span className="tiny-square" /> OPEN CRISIS INTELLIGENCE PROJECT</div>
            <div className="prototype-label" suppressHydrationWarning><span className={cn('status-dot', hasMounted && error && 'status-dot-error')} /> {!hasMounted || isLoading ? 'CONNECTING TO LIVE SOURCES' : error && wildfireError && gdacsError ? 'LIVE SOURCES UNAVAILABLE · FALLBACK PINS' : 'LIVE SOURCES CONNECTED · USGS + NASA FIRMS + GDACS'}</div>
          </div>
          <div className="hero-copy">
            <h1 id="hero-title">Pulse<span>Watch</span><span className="title-period">.</span></h1>
            <div className="hero-introduction">
              <h2>Live earthquake activity, wildfire detections, and disaster alerts.<br />Clearer global context. <span>One live map.</span></h2>
              <p>A focused crisis intelligence experience combining live USGS earthquakes, NASA FIRMS wildfire detections, and GDACS disaster alerts — designed for people who need clear signal without five different websites.</p>
              <div className="hero-buttons">
                <Button size="lg" onClick={() => setExploring(true)}><Crosshair data-icon="inline-start" /> Explore the map <ArrowUpRight data-icon="inline-end" /></Button>
                <a href="#solution" className={buttonVariants({ variant: 'ghost', size: 'lg' })}>Discover the project <ArrowDown data-icon="inline-end" /></a>
              </div>
              <div className="hero-built-for"><span className="small-cross">+</span> BUILT FOR FASTER DECISIONS. NOT MORE TABS.</div>
            </div>
          </div>
          {exploring && <div className="explore-header"><p>One planet. Every signal.</p><Button variant="outline" onClick={() => { setExploring(false); setShowDetails(false) }}><X data-icon="inline-start" /> Exit map view</Button></div>}
          {activeSelected && (
            <aside className={cn('map-event-card', `event-card-${activeSelected.type}`)} aria-label={`Selected ${activeSelected?.type ?? 'hazard'} event`} aria-live="polite">
              <div className="event-card-top"><span><SelectedIcon size={13} aria-hidden="true" /> {eventCategories[activeSelected.type].label === 'Floods & climate' ? 'CLIMATE ALERT' : activeSelected.type.toUpperCase()}</span><span className="event-sample">{activeSelected.url ? 'LIVE EVENT' : 'FALLBACK PIN'}</span></div>
              <div className="event-card-title"><h3>{activeSelected.title}</h3><Button variant="ghost" size="icon-xs" aria-label="Dismiss selected event" onClick={() => { setSelected(null); setShowDetails(false) }}><X /></Button></div>
              <div className="event-card-meta"><strong>{activeSelected.magnitude}</strong><span className="meta-divider" />{activeSelected.severity} severity<span className="event-source">{activeSelected.source}</span></div>
              {showDetails && <><p className="event-description">{activeSelected.description}</p>{activeSelected.url && <a className="event-official-link" href={activeSelected.url} target="_blank" rel="noreferrer">Open official USGS event <ArrowUpRight size={13} aria-hidden="true" /></a>}</>}
              <button className="event-detail-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide event details' : 'View event details'}<ArrowUpRight size={13} aria-hidden="true" /></button>
            </aside>
          )}
          <div className="hero-map-footer">
            <div className="map-filters"><span className="eyebrow legend-label">MAP LAYERS</span><ToggleGroup multiple value={categories} onValueChange={changeCategories} aria-label="Visible live hazard layers" size="sm" spacing={1}>{allCategories.map((category) => <ToggleGroupItem key={category} value={category} aria-label={`Toggle ${eventCategories[category].label.toLowerCase()}`}><span className={cn('legend-dot', `dot-${category}`)} />{eventCategories[category].label}</ToggleGroupItem>)}</ToggleGroup></div>
            <p className="map-demo-note"><span className="demo-note-desktop">{hasMounted && (data?.source || wildfireData?.source || gdacsData?.source) ? 'USGS + NASA FIRMS + GDACS LIVE FEEDS' : error && wildfireError && gdacsError ? 'LIVE SOURCES UNAVAILABLE' : 'LIVE SOURCES CONNECTING'}</span><span className="map-note-divider">/</span><span aria-live="polite">{visibleEvents.length} live events</span><button type="button" onClick={() => { void mutate(); void mutateWildfire(); void mutateGdacs() }} className="refresh-feed">Refresh feeds</button></p>
          </div>
          {exploring && <div className="accessible-event-picker"><label htmlFor="event-picker">Explore an event</label><select id="event-picker" value={selected?.id ?? ''} onChange={(event) => { const found = visibleEvents.find((item) => item.id === event.target.value); if (found) selectEvent(found) }}><option value="">Select an event</option>{visibleEvents.map((event) => <option key={event.id} value={event.id}>{event.location} — {event.magnitude}</option>)}</select></div>}
        </div>
        <div className="map-attribution">Map: OpenStreetMap · Leaflet</div>
      </section>
      <section className="source-strip" aria-label="Live official data sources">
        <div className="page-width source-strip-inner">
          <div className="source-strip-heading"><Radio size={17} aria-hidden="true" /><span>THREE LIVE SOURCES.<br /><strong>ONE CLEAR VIEW.</strong></span></div>
          <a href="https://earthquake.usgs.gov/earthquakes/feed/" target="_blank" rel="noreferrer" className="source-partner"><Activity aria-hidden="true" /><span><strong>USGS</strong><small>Earthquake intelligence</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noreferrer" className="source-partner"><Globe2 aria-hidden="true" /><span><strong>NASA <span className="source-subname">FIRMS</span></strong><small>Live satellite detections</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="https://www.gdacs.org/" target="_blank" rel="noreferrer" className="source-partner"><Layers3 aria-hidden="true" /><span><strong>GDACS</strong><small>Live global disaster alerts</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
          <div className="source-integrity"><ShieldCheck size={17} aria-hidden="true" /><span>OFFICIAL DATA.<br />CLEAR STATUS.</span></div>
        </div>
      </section>
      <div className="page-width project-facts" aria-label="Project at a glance">
        <div><strong>03</strong><span>Live data sources</span></div><div><strong>01</strong><span>Unified global view</span></div><div><strong>00</strong><span>Hardware required</span></div><div className="fact-final"><Globe2 aria-hidden="true" /><span>Global perspective.<br /><strong>Local impact.</strong></span><a href="#problem" aria-label="Scroll to the problem"><ArrowDown size={18} /></a></div>
      </div>
    </>
  )
}
