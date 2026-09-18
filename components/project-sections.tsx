import { Activity, ArrowDown, ArrowRight, ArrowUpRight, Bell, Braces, Building2, Check, CircleDot, Code2, Database, Earth, Flame, Handshake, Layers3, Map, Radio, Satellite, ScanLine, ShieldCheck, Sprout, Users, Waves, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span><span className="section-label-line" /><span>{children}</span></div>
}

export function ProblemSection() {
  return (
    <section id="problem" className="project-section problem-section page-width" aria-labelledby="problem-heading">
      <SectionLabel number="01">THE PROBLEM</SectionLabel>
      <div className="section-heading-grid"><h2 id="problem-heading">Disasters don&apos;t wait.<br /><span className="text-muted-foreground">Why should responders?</span></h2><p>When disaster strikes, critical information is scattered. Small NGOs and local responders lose precious time checking multiple portals instead of doing what matters: <strong>acting.</strong></p></div>
      <div className="fragmented-grid">
        <article><div className="fragmented-card-top"><Activity aria-hidden="true" /><span>01 / SEISMIC</span><ArrowUpRight aria-hidden="true" /></div><h3>Earthquakes here.</h3><p>USGS earthquake portal</p><div className="mini-seismic" aria-hidden="true">{[8, 14, 9, 25, 12, 17, 45, 73, 30, 16, 40, 94, 56, 20, 31, 15, 9, 21, 11, 6, 17, 8, 25, 12, 7, 19, 11, 5, 13, 8, 18, 9].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><span className="portal-label">SEPARATE PORTAL <span>↗</span></span></article>
        <article><div className="fragmented-card-top"><Flame aria-hidden="true" /><span>02 / WILDFIRE</span><ArrowUpRight aria-hidden="true" /></div><h3>Wildfires there.</h3><p>NASA FIRMS satellite systems</p><div className="mini-fire-grid" aria-hidden="true">{Array.from({ length: 80 }, (_, index) => <i key={index} data-active={[12, 13, 14, 23, 24, 31, 32, 33, 34, 35, 43, 44, 45, 54, 55, 56, 65].includes(index)} />)}</div><span className="portal-label">ANOTHER PORTAL <span>↗</span></span></article>
        <article><div className="fragmented-card-top"><Waves aria-hidden="true" /><span>03 / CLIMATE</span><ArrowUpRight aria-hidden="true" /></div><h3>Everything else, elsewhere.</h3><p>GDACS floods, cyclones & droughts</p><div className="mini-climate" aria-hidden="true"><span /><span /><span /><span /><span /></div><span className="portal-label">YET ANOTHER PORTAL <span>↗</span></span></article>
      </div>
      <div className="problem-bottom"><p><span className="small-cross">+</span> The data exists. <strong>The unified view doesn&apos;t.</strong></p><span className="eyebrow">FRAGMENTED INFORMATION. REAL-WORLD CONSEQUENCES.</span></div>
      <div className="research-stats" aria-label="Verified impact statistics"><div><strong>4.0B+</strong><p>People Impacted by Disasters<br /><small>2000–Present, UNDRR</small></p></div><div><strong>$2.97T</strong><p>Global Economic Losses<br /><small>from Natural Hazards</small></p></div><div><strong>01</strong><p>Unified response view<br /><small>Built for faster intervention</small></p></div></div><p className="impact-context">Disaster records from the UNDRR and EM-DAT reveal a sharp rise in extreme events. Fragmented feeds across siloed agency portals delay critical emergency intervention.</p>
    </section>
  )
}

const steps = [
  { icon: Radio, title: 'Collect the signal.', body: 'Read official USGS earthquakes and NASA FIRMS thermal detections through server-side routes.' },
  { icon: Map, title: 'Connect the dots.', body: 'Plot each event on one interactive, globally accessible map.' },
  { icon: ScanLine, title: 'Surface what matters.', body: 'Normalize event signals into clear, color-coded severity indicators.' },
  { icon: Users, title: 'Make action clearer.', body: 'Give responders one shared picture. Less searching, faster decisions.' },
]

export function SolutionSection() {
  return (
    <section id="solution" className="solution-section section-surface" aria-labelledby="solution-heading"><div className="page-width project-section">
      <SectionLabel number="02">OUR SOLUTION</SectionLabel>
      <div className="section-heading-grid"><h2 id="solution-heading">One planet.<br /><span className="text-primary">One shared picture.</span></h2><div><p>PulseWatch turns live USGS earthquakes and NASA FIRMS thermal detections into one interactive map. Every event is normalized, scored transparently, and color-coded for quick context.</p><Badge variant="outline" className="prototype-badge"><CircleDot data-icon="inline-start" /> Live USGS feed · Server-validated data</Badge></div></div>
      <div className="flow-steps">{steps.map((step, index) => <article key={step.title}><div className="flow-icon-row"><span className="flow-icon"><step.icon aria-hidden="true" /></span><span className="flow-connector" /><span className="flow-number">0{index + 1}</span></div><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
      <div className="solution-bottom"><ShieldCheck size={17} aria-hidden="true" /><p>Public information. Shared intelligence. <strong>A clearer path to action.</strong></p><a href="#map">Explore the live map <ArrowUpRight size={15} aria-hidden="true" /></a></div>
    </div></section>
  )
}

const technologies = [
  { icon: Activity, tag: 'DATA SOURCE / 01', title: 'USGS Earthquake API', description: 'Public earthquake feeds with location, magnitude, depth, and event timestamps.', foot: 'Public API · No key required', href: 'https://earthquake.usgs.gov/earthquakes/feed/' },
  { icon: Satellite, tag: 'LIVE DATA LAYER / 02', title: 'NASA FIRMS', description: 'Satellite-based thermal anomaly detections with fire radiative power and confidence context.', foot: 'VIIRS SNPP NRT · Server fetched', href: 'https://firms.modaps.eosdis.nasa.gov/' },
  { icon: Earth, tag: 'PLANNED DATA LAYER / 03', title: 'GDACS', description: 'A planned global alert layer for floods, cyclones, and other hazards.', foot: 'Not connected yet', href: 'https://www.gdacs.org/' },
  { icon: Map, tag: 'THE VISUAL LAYER', title: 'Leaflet', description: 'An interactive, lightweight map with explorable USGS earthquake markers.', foot: 'Interactive map · Open source', href: 'https://leafletjs.com/' },
  { icon: Code2, tag: 'THE FOUNDATION', title: 'Next.js + React', description: 'A responsive web experience that works wherever a responder needs it. No installation required.', foot: 'Web-first · Built to scale', href: 'https://nextjs.org/' },
  { icon: Braces, tag: 'THE INTELLIGENCE', title: 'Severity scoring', description: 'A transparent informational score using earthquake magnitude, depth, and recency.', foot: 'Explainable logic · No prediction', href: '#map' },
]

export function TechnologySection() {
  return (
    <section id="technology" className="project-section page-width" aria-labelledby="technology-heading">
      <SectionLabel number="03">HOW IT&apos;S BUILT</SectionLabel>
      <div className="section-heading-grid"><h2 id="technology-heading">Real data.<br />Not another black box.</h2><p>We&apos;re not building a new network of sensors. We&apos;re making the extraordinary information that already exists easier to use.</p></div>
      <div className="technology-grid">{technologies.map((technology) => <article key={technology.title}><div className="technology-card-top"><technology.icon aria-hidden="true" /><a href={technology.href} target={technology.href.startsWith('http') ? '_blank' : undefined} rel={technology.href.startsWith('http') ? 'noreferrer' : undefined} aria-label={`Learn more about ${technology.title}`}><ArrowUpRight size={17} /></a></div><span className="eyebrow">{technology.tag}</span><h3>{technology.title}</h3><p>{technology.description}</p><span className="technology-foot"><span className="tiny-square" />{technology.foot}</span></article>)}</div>
      <div className="hardware-note"><Zap aria-hidden="true" /><p><strong>No hardware. No sensors of our own.</strong> The planned platform runs entirely on real official data already being collected by government and space agencies.</p><span className="eyebrow">SOFTWARE. WITH PURPOSE.</span></div>
    </section>
  )
}

export function ImpactSection() {
  const goals = [
    { number: '11', icon: Building2, name: 'Sustainable cities\nand communities', description: 'Help local responders build more resilient communities through accessible crisis information.', link: 'https://sdgs.un.org/goals/goal11' },
    { number: '13', icon: Sprout, name: 'Climate\naction', description: 'Make climate-related hazards more visible and support faster, better-informed responses.', link: 'https://sdgs.un.org/goals/goal13' },
    { number: '17', icon: Handshake, name: 'Partnerships\nfor the goals', description: 'Connect public data, student innovation, and NGO expertise around a shared humanitarian purpose.', link: 'https://sdgs.un.org/goals/goal17' },
  ]
  return (
    <section className="section-surface" id="impact" aria-labelledby="impact-heading"><div className="page-width project-section">
      <SectionLabel number="04">BUILT FOR A BIGGER PURPOSE</SectionLabel>
      <div className="section-heading-grid"><h2 id="impact-heading">Technology is the tool.<br /><span className="text-muted-foreground">Resilience is the goal.</span></h2><p>Aligned with three United Nations Sustainable Development Goals. Because a better interface should lead to a better outcome.</p></div>
      <div className="sdg-grid">{goals.map((goal) => <a className={cn('sdg-card', `sdg-${goal.number}`)} key={goal.number} href={goal.link} target="_blank" rel="noreferrer"><div className="sdg-heading"><strong>{goal.number}</strong><span>{goal.name}</span><goal.icon aria-hidden="true" /></div><p>{goal.description}</p><span className="sdg-link">SUSTAINABLE DEVELOPMENT GOAL <ArrowUpRight size={15} aria-hidden="true" /></span></a>)}</div>
    </div></section>
  )
}

export function DifferenceSection() {
  return <section className="difference-section page-width" aria-labelledby="difference-heading"><SectionLabel number="05">WHAT MAKES THIS DIFFERENT</SectionLabel><div className="difference-content"><span className="difference-cross" aria-hidden="true">+</span><div><h2 id="difference-heading">One glance.<br /><span className="text-primary">Not five browser tabs.</span></h2><p>Specialist tools go deep on individual hazards. PulseWatch is designed to bring the signals together in one free, unified view — built around the people who need to act, not the systems that collect the data.</p><div className="difference-principles"><span><Check size={14} aria-hidden="true" /> Free by design</span><span><Check size={14} aria-hidden="true" /> Multi-hazard</span><span><Check size={14} aria-hidden="true" /> Responder-first</span></div></div></div></section>
}

const phases = [
  { number: '01', status: 'LIVE NOW', title: 'One map. Two feeds.', description: 'Server-validated USGS earthquake and NASA FIRMS wildfire feeds with transparent informational scoring.', icon: Layers3 },
  { number: '02', status: 'UP NEXT', title: 'Your region. Your alerts.', description: 'Opt-in subscriptions for the regions and hazard types that matter to each responder.', icon: Bell },
  { number: '03', status: 'IN THE FIELD', title: 'Built with responders.', description: 'Partner with an NGO to test the platform in real workflows and learn what actually helps.', icon: Handshake },
  { number: '04', status: 'LOOKING AHEAD', title: 'From reactive to ready.', description: 'Explore historical patterns to flag high-risk regions before events reach their peak.', icon: ScanLine },
]

export function RoadmapSection() {
  return <section className="project-section page-width roadmap-section" id="roadmap" aria-labelledby="roadmap-heading"><SectionLabel number="06">THE ROAD AHEAD</SectionLabel><div className="section-heading-grid"><h2 id="roadmap-heading">Start with clarity.<br />Build toward impact.</h2><p>A focused roadmap. Real milestones.<br />Each step shaped by the people who will use it.</p></div><div className="roadmap-grid">{phases.map((phase, index) => <article key={phase.number} className={cn(index === 0 && 'phase-current')}><div className="roadmap-track"><span className="roadmap-node">{index === 0 && <span />}</span></div><div className="phase-status"><span>PHASE {phase.number}</span><span>{phase.status}</span></div><phase.icon className="phase-icon" aria-hidden="true" /><h3>{phase.title}</h3><p>{phase.description}</p></article>)}</div></section>
}

export function TeamSection() {
  return <section className="section-surface" id="team" aria-labelledby="team-heading"><div className="page-width project-section"><SectionLabel number="07">THE PEOPLE BEHIND THE PULSE</SectionLabel><div className="section-heading-grid"><h2 id="team-heading">Student-built.<br /><span className="text-muted-foreground">Humanity-focused.</span></h2><p>An independent student-built project with a simple belief: useful technology should reach the people who need it.</p></div><div className="team-grid"><article className="team-card"><div className="team-avatar">OP<span className="tiny-square" /></div><span className="eyebrow">DESIGN & DEVELOPMENT</span><h3>Om Prakash Pattnayak</h3><p>Building PulseWatch at the intersection of open data, thoughtful design, and humanitarian technology.</p><a href="#contact">Connect with the team <ArrowUpRight size={15} aria-hidden="true" /></a></article>{[{ number: '02', role: 'DATA & INTEGRATION' }, { number: '03', role: 'RESEARCH & OUTREACH' }].map((person) => <article className="team-card team-placeholder" key={person.number}><div className="team-avatar"><Users size={29} aria-hidden="true" /><span>{person.number}</span></div><span className="eyebrow">{person.role}</span><h3>[Team member name]</h3><p>[A short introduction, area of expertise, and contribution to the project.]</p><span className="team-pending">TEAM PROFILE COMING SOON</span></article>)}</div></div></section>
}
