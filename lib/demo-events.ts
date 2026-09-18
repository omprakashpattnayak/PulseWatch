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
}

export const eventCategories: Record<EventType, { label: string; color: string }> = {
  earthquake: { label: 'Earthquakes', color: '#ff8146' },
  wildfire: { label: 'Wildfires', color: '#efbd58' },
  climate: { label: 'Floods & climate', color: '#66c7ce' },
}

// Illustrative scenarios only; these are not current alerts or verified observations.
export const demoEvents: DemoEvent[] = [
  { id: 'japan', type: 'earthquake', title: 'Off the coast of Japan', location: 'Japan', coordinates: [36.2, 141.7], severity: 'High', magnitude: 'M 6.2', source: 'USGS', description: 'An example earthquake alert. A connected feed would show the observed magnitude, depth, and official event link.' },
  { id: 'turkey', type: 'earthquake', title: 'Southern Türkiye', location: 'Türkiye', coordinates: [37.1, 36.8], severity: 'High', magnitude: 'M 5.8', source: 'USGS', description: 'An illustrative regional earthquake. This scenario demonstrates how seismic activity appears alongside other hazard types.' },
  { id: 'california', type: 'earthquake', title: 'Southern California', location: 'United States', coordinates: [34.1, -117.4], severity: 'Moderate', magnitude: 'M 4.6', source: 'USGS', description: 'An example moderate earthquake. Magnitude-based severity is a prototype indicator, not an official impact assessment.' },
  { id: 'chile', type: 'earthquake', title: 'Northern Chile', location: 'Chile', coordinates: [-22.9, -69.1], severity: 'High', magnitude: 'M 6.4', source: 'USGS', description: 'An illustrative earthquake along the Pacific Ring of Fire. No current emergency is implied.' },
  { id: 'indonesia', type: 'earthquake', title: 'South of Java', location: 'Indonesia', coordinates: [-9.2, 110.5], severity: 'Moderate', magnitude: 'M 5.1', source: 'USGS', description: 'An example offshore seismic event. Operational use would require verification with local authorities.' },
  { id: 'brazil', type: 'wildfire', title: 'Amazon fire detections', location: 'Brazil', coordinates: [-7.1, -58.4], severity: 'High', magnitude: 'Fire cluster', source: 'NASA FIRMS', description: 'Illustrative satellite thermal detections. A detection is not by itself a confirmed wildfire or an assessment of damage.' },
  { id: 'canada', type: 'wildfire', title: 'Boreal forest detections', location: 'Canada', coordinates: [56.7, -108.4], severity: 'Moderate', magnitude: 'Thermal anomaly', source: 'NASA FIRMS', description: 'An example satellite thermal anomaly. A connected feed would include detection time, confidence, and fire radiative power.' },
  { id: 'australia', type: 'wildfire', title: 'Western Australia', location: 'Australia', coordinates: [-26.1, 121.7], severity: 'High', magnitude: 'Fire cluster', source: 'NASA FIRMS', description: 'A demonstration fire cluster, included to show simultaneous monitoring across continents.' },
  { id: 'africa', type: 'wildfire', title: 'Central African detections', location: 'Central Africa', coordinates: [6.4, 19.7], severity: 'Moderate', magnitude: 'Thermal anomaly', source: 'NASA FIRMS', description: 'Illustrative thermal activity. Satellite detections can include agricultural burning and require contextual interpretation.' },
  { id: 'bangladesh', type: 'climate', title: 'Brahmaputra river basin', location: 'Bangladesh', coordinates: [24.6, 89.8], severity: 'High', magnitude: 'Flood alert', source: 'GDACS', description: 'An illustrative flood scenario. The connected platform would link to the official GDACS alert and impact information.' },
  { id: 'mozambique', type: 'climate', title: 'Southwest Indian Ocean', location: 'Near Mozambique', coordinates: [-18.2, 44.9], severity: 'High', magnitude: 'Cyclone alert', source: 'GDACS', description: 'An example tropical cyclone alert. This is a design demonstration, not a forecast or a live warning.' },
  { id: 'kenya', type: 'climate', title: 'Horn of Africa', location: 'East Africa', coordinates: [3.2, 42.4], severity: 'Moderate', magnitude: 'Drought alert', source: 'GDACS', description: 'An illustrative slow-onset drought scenario, showing how longer-term crises can appear alongside rapid-onset events.' },
]
