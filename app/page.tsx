import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import {
  ProblemSection,
  SolutionSection,
  TechnologySection,
  ImpactSection,
  DifferenceSection,
  RoadmapSection,
  TeamSection,
} from '@/components/project-sections'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <TechnologySection />
        <ImpactSection />
        <DifferenceSection />
        <RoadmapSection />
        <TeamSection />
      </main>
    </>
  )
}
