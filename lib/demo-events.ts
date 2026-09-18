export type EventType = 'earthquake' | 'wildfire' | 'climate'

export type DemoEvent = {
  id: string
  type: EventType
  title: string
  location: string
  coordinates: [number, number]
  severity: 'High' | 'Moderate'
  magnitude: string
  source: string
  description: string
  url?: string
  timestamp?: number
}

export const eventCategories: Record<EventType, { label: string; color: string }> = {
  earthquake: { label: 'Earthquakes', color: '#ff8146' },
  wildfire: { label: 'Wildfires', color: '#efbd58' },
  climate: { label: 'Floods & climate', color: '#66c7ce' },
}

