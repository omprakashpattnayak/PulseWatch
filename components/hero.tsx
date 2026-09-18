'use client'

import { useState } from 'react'
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

export function Hero() {
  const [exploring, setExploring] = useState(false)
  const [categories, setCategories] = useState<EventType[]>(allCategories)
  const [selected, setSelected] = useState<DemoEvent | null>(demoEvents[0])
  const [showDetails, setShowDetails] = useState(false)
  const visibleEvents = demoEvents.filter((event) => categories.includes(event.type))
  const SelectedIcon = selected ? categoryIcons[selected.type] : Activity

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
        <div className="hero-map-layer"><CrisisMap categories={categories} selectedId={selected?.id ?? null} onSelect={selectEvent} exploring={exploring} /></div>
        <div className="hero-map-shade" aria-hidden="true" />
        <div className="page-width hero-inner">
          <div className="hero-topline">
            <div className="eyebrow competition-label"><span className="tiny-square" /> OPEN CRISIS INTELLIGENCE PROJECT</div>
            <div className="prototype-label"><span className="status-dot" /> PROTOTYPE MODE</div>
          </div>
          <div className="hero-copy">
            <h1 id="hero-title">Pulse<span>Watch</span><span className="title-period">.</span></h1>
            <div className="hero-introduction">
              <h2>Every earthquake. Every wildfire.<br />Every disaster alert. <span>One live map.</span></h2>
              <p>A real-time global crisis intelligence platform fusing three official data sources — built for the responders and NGOs who don&apos;t have time for five different websites.</p>
              <div className="hero-buttons">
                <Button size="lg" onClick={() => setExploring(true)}><Crosshair data-icon="inline-start" /> Explore the map <ArrowUpRight data-icon="inline-end" /></Button>
                <a href="#solution" className={buttonVariants({ variant: 'ghost', size: 'lg' })}>Discover the project <ArrowDown data-icon="inline-end" /></a>
              </div>
              <div className="hero-built-for"><span className="small-cross">+</span> BUILT FOR FASTER DECISIONS. NOT MORE TABS.</div>
            </div>
          </div>
          {exploring && <div className="explore-header"><p>One planet. Every signal.</p><Button variant="outline" onClick={() => { setExploring(false); setShowDetails(false) }}><X data-icon="inline-start" /> Exit map view</Button></div>}
          {selected && (
            <aside className={cn('map-event-card', `event-card-${selected.type}`)} aria-label="Selected illustrative event" aria-live="polite">
              <div className="event-card-top"><span><SelectedIcon size={13} aria-hidden="true" /> {eventCategories[selected.type].label === 'Floods & climate' ? 'CLIMATE ALERT' : selected.type.toUpperCase()}</span><span className="event-sample">DEMO EVENT</span></div>
              <div className="event-card-title"><h3>{selected.title}</h3><Button variant="ghost" size="icon-xs" aria-label="Dismiss selected event" onClick={() => { setSelected(null); setShowDetails(false) }}><X /></Button></div>
              <div className="event-card-meta"><strong>{selected.magnitude}</strong><span className="meta-divider" />{selected.severity} severity<span className="event-source">{selected.source}</span></div>
              {showDetails && <p className="event-description">{selected.description}</p>}
              <button className="event-detail-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide event details' : 'View event details'}<ArrowUpRight size={13} aria-hidden="true" /></button>
            </aside>
          )}
          <div className="hero-map-footer">
            <div className="map-filters"><span className="eyebrow legend-label">MAP LAYERS</span><ToggleGroup multiple value={categories} onValueChange={changeCategories} aria-label="Visible disaster layers" size="sm" spacing={1}>{allCategories.map((category) => <ToggleGroupItem key={category} value={category} aria-label={`Toggle ${eventCategories[category].label.toLowerCase()}`}><span className={cn('legend-dot', `dot-${category}`)} />{eventCategories[category].label}</ToggleGroupItem>)}</ToggleGroup></div>
            <p className="map-demo-note"><span className="demo-note-desktop">INTERACTIVE PREVIEW</span><span className="map-note-divider">/</span><span aria-live="polite">{visibleEvents.length} illustrative events</span><span>Not live data</span></p>
          </div>
          {exploring && <div className="accessible-event-picker"><label htmlFor="event-picker">Explore an event</label><select id="event-picker" value={selected?.id ?? ''} onChange={(event) => { const found = visibleEvents.find((item) => item.id === event.target.value); if (found) selectEvent(found) }}><option value="">Select an illustrative event</option>{visibleEvents.map((event) => <option key={event.id} value={event.id}>{event.location} — {event.magnitude}</option>)}</select></div>}
        </div>
        <div className="map-attribution">Map: Natural Earth · Leaflet</div>
      </section>
      <section className="source-strip" aria-label="Planned official data sources">
        <div className="page-width source-strip-inner">
          <div className="source-strip-heading"><Radio size={17} aria-hidden="true" /><span>THREE TRUSTED SOURCES.<br /><strong>ONE COMMON PURPOSE.</strong></span></div>
          <a href="https://earthquake.usgs.gov/earthquakes/feed/" target="_blank" rel="noreferrer" className="source-partner"><Activity aria-hidden="true" /><span><strong>USGS</strong><small>Earthquake intelligence</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noreferrer" className="source-partner"><Globe2 aria-hidden="true" /><span><strong>NASA <span className="source-subname">FIRMS</span></strong><small>Satellite fire detection</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="https://www.gdacs.org/" target="_blank" rel="noreferrer" className="source-partner"><Layers3 aria-hidden="true" /><span><strong>GDACS</strong><small>Global disaster alerts</small></span><ArrowUpRight size={13} aria-hidden="true" /></a>
          <div className="source-integrity"><ShieldCheck size={17} aria-hidden="true" /><span>OFFICIAL DATA.<br />NO GUESSWORK.</span></div>
        </div>
      </section>
      <div className="page-width project-facts" aria-label="Project at a glance">
        <div><strong>03</strong><span>Official data sources</span></div><div><strong>01</strong><span>Unified global view</span></div><div><strong>00</strong><span>Hardware required</span></div><div className="fact-final"><Globe2 aria-hidden="true" /><span>Global perspective.<br /><strong>Local impact.</strong></span><a href="#problem" aria-label="Scroll to the problem"><ArrowDown size={18} /></a></div>
      </div>
    </>
  )
}
