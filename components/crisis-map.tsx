'use client'

import { useEffect } from 'react'
import { MapContainer, Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type DemoEvent, type EventType } from '@/lib/demo-events'

const continentLabels: { text: string; position: [number, number] }[] = [
  { text: 'NORTH AMERICA', position: [44, -110] },
  { text: 'SOUTH AMERICA', position: [-14, -59] },
  { text: 'EUROPE', position: [52, 20] },
  { text: 'AFRICA', position: [15, 17] },
  { text: 'ASIA', position: [48, 88] },
  { text: 'OCEANIA', position: [-26, 135] },
]

function MapControls({ exploring }: { exploring: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (exploring) {
      map.dragging.enable()
      map.scrollWheelZoom.enable()
      map.doubleClickZoom.enable()
      map.touchZoom.enable()
      map.keyboard.enable()
    } else {
      map.dragging.disable()
      map.scrollWheelZoom.disable()
      map.doubleClickZoom.disable()
      map.touchZoom.disable()
      map.keyboard.disable()
    }
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map, exploring])

  function resetView() {
    map.setView([19, 12], map.getSize().x < 600 ? 1.25 : 2.25, { animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches })
  }

  useEffect(() => {
    map.setView([19, 12], map.getSize().x < 600 ? 1.25 : 2.25)
  }, [map])

  return (
    <div className="map-zoom-controls">
      <Button variant="outline" size="icon" onClick={() => map.zoomIn(1)} aria-label="Zoom in on map" title="Zoom in"><Plus /></Button>
      <Button variant="outline" size="icon" onClick={() => map.zoomOut(0.5)} aria-label="Zoom out on map"><Minus /></Button>
      <Button variant="outline" size="icon" onClick={resetView} aria-label="Reset global map view"><LocateFixed /></Button>
    </div>
  )
}

export default function CrisisMap({ events, categories, selectedId, onSelect, exploring }: {
  events: DemoEvent[]
  categories: EventType[]
  selectedId: string | null
  onSelect: (event: DemoEvent) => void
  exploring: boolean
}) {
  return (
    <MapContainer center={[19, 12]} zoom={2.25} minZoom={1} maxZoom={18} zoomDelta={1} zoomSnap={0.1} wheelPxPerZoomLevel={80} zoomAnimation={true} zoomControl={false} attributionControl={false} scrollWheelZoom={exploring} doubleClickZoom={exploring} dragging={exploring} touchZoom={exploring} keyboard={exploring} className="crisis-map" aria-label="Interactive demonstration world map of illustrative disaster events">
      {continentLabels.map(({ text, position }) => <Marker key={text} position={position} interactive={false} keyboard={false} icon={divIcon({ className: 'continent-label', html: text, iconSize: [130, 16], iconAnchor: [65, 8] })} />)}
      {events.filter((event) => categories.includes(event.type)).map((event) => (
        <Marker key={event.id} position={event.coordinates} title={`Demo: ${event.magnitude}, ${event.title}`} alt={`View illustrative ${event.type} event in ${event.location}`} icon={divIcon({ className: `event-marker marker-${event.type}${selectedId === event.id ? ' marker-selected' : ''}`, html: '<span class="marker-halo"></span><span class="marker-ring"></span><span class="marker-core"></span>', iconSize: [36, 36], iconAnchor: [18, 18] })} eventHandlers={{ click: () => onSelect(event) }} />
      ))}
      <MapControls exploring={exploring} />
    </MapContainer>
  )
}
