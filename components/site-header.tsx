'use client'

import { useState } from 'react'
import { Activity, ArrowUpRight, Menu, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { label: 'The problem', href: '#problem' },
  { label: 'Our solution', href: '#solution' },
  { label: 'The technology', href: '#technology' },
  { label: 'Roadmap', href: '#roadmap' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="page-width header-inner">
        <a className="brand" href="#" aria-label="PulseWatch home">
          <Activity className="brand-mark" aria-hidden="true" />
          <span>pulsewatch<span className="brand-period">.</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          <a href="#contact">Let&apos;s connect</a>
        </nav>
        <div className="header-actions">
          <a className="header-dashboard-link" href="/dashboard">Dashboard</a>
          <a className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'header-contact')} href="#contact">
            Let&apos;s connect <ArrowUpRight data-icon="inline-end" />
          </a>
          <Button variant="ghost" size="icon" className="mobile-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav page-width" aria-label="Mobile navigation">
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}
          <a href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard<ArrowUpRight size={15} aria-hidden="true" /></a>
          <a href="/sign-in" onClick={() => setMenuOpen(false)}>Sign in<ArrowUpRight size={15} aria-hidden="true" /></a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Let&apos;s connect<ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
      )}
    </header>
  )
}
