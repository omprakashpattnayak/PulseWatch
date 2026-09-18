'use client'

import { useEffect } from 'react'
import { MapContainer, GeoJSON, Marker, Polyline, useMap } from 'react-leaflet'
import { divIcon, type LatLngExpression } from 'leaflet'
import { feature } from 'topojson-client'
import type { FeatureCollection, GeometryCollection } from 'geojson'
import worldData from 'world-atlas/countries-110m.json'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { demoEvents, type DemoEvent, type EventType } from '@/lib/demo-events'

type WorldTopology = {
  type: 'Topology'
  objects: { countries: GeometryCollection }
  arcs: number[][][]
  transform?: { scale: [number, number]; translate: [number, number] }
}

const topology = worldData as unknown as WorldTopology
const countries = feature(topology as Parameters<typeof feature>[0], topology.objects.countries as never) as unknown as FeatureCollection
const land: FeatureCollection = { ...countries, features: countries.features.filter((country) => country.id !== '010') }
const gridLines: LatLngExpression[][] = [
  ...[-60, -30, 0, 30, 60].map((latitude) => [[latitude, -180], [latitude, 180]] as LatLngExpression[]),
  ...[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((longitude) => [[-70, longitude], [80, longitude]] as LatLngExpression[]),
]
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
    if (exploring) map.dragging.enable()
    else map.dragging.disable()
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
      <Button variant="outline" size="icon" onClick={() => map.zoomIn(0.5)} aria-label="Zoom in on map"><Plus /></Button>
      <Button variant="outline" size="icon" onClick={() => map.zoomOut(0.5)} aria-label="Zoom out on map"><Minus /></Button>
      <Button variant="outline" size="icon" onClick={resetView} aria-label="Reset global map view"><LocateFixed /></Button>
    </div>
  )
}

export default function CrisisMap({ categories, selectedId, onSelect, exploring }: {
  categories: EventType[]
  selectedId: string | null
  onSelect: (event: DemoEvent) => void
  exploring: boolean
}) {
  return (
    <MapContainer center={[19, 12]} zoom={2.25} minZoom={1} maxZoom={6} zoomSnap={0.25} zoomControl={false} attributionControl={false} scrollWheelZoom={false} doubleClickZoom={exploring} dragging={false} touchZoom={exploring} keyboard={exploring} className="crisis-map" aria-label="Interactive demonstration world map of illustrative disaster events">
      {gridLines.map((positions, index) => <Polyline key={index} positions={positions} pathOptions={{ color: '#263539', weight: 0.65, opacity: 0.43 }} interactive={false} />)}
      <GeoJSON data={land} style={{ fillColor: '#152326', fillOpacity: 1, color: '#304043', weight: 0.6, opacity: 0.85 }} interactive={false} />
      {continentLabels.map(({ text, position }) => <Marker key={text} position={position} interactive={false} keyboard={false} icon={divIcon({ className: 'continent-label', html: text, iconSize: [130, 16], iconAnchor: [65, 8] })} />)}
      {demoEvents.filter((event) => categories.includes(event.type)).map((event) => (
        <Marker key={event.id} position={event.coordinates} title={`Demo: ${event.magnitude}, ${event.title}`} alt={`View illustrative ${event.type} event in ${event.location}`} icon={divIcon({ className: `event-marker marker-${event.type}${selectedId === event.id ? ' marker-selected' : ''}`, html: '<span class="marker-halo"></span><span class="marker-ring"></span><span class="marker-core"></span>', iconSize: [36, 36], iconAnchor: [18, 18] })} eventHandlers={{ click: () => onSelect(event) }} />
      ))}
      <MapControls exploring={exploring} />
    </MapContainer>
  )
}
