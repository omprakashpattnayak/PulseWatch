'use client'

import { useState, type FormEvent } from 'react'
import { Activity, ArrowRight, ArrowUp, ArrowUpRight, Check, Copy, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SectionLabel } from '@/components/project-sections'

export function ContactSection() {
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    if (!name || !email || !message) return
    setDraft(`Hello PulseWatch team,\n\n${message}\n\n${name}\n${email}`)
    setCopied(false)
    setFeedback('Inquiry dispatched • PulseWatch Open Research Desk')
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      setFeedback('Introduction copied. You can now share it with the project team.')
    } catch {
      setFeedback('Clipboard access is unavailable. Download your introduction instead.')
    }
  }

  function downloadDraft() {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'pulsewatch-introduction.txt'
    anchor.click()
    URL.revokeObjectURL(url)
    setFeedback('Introduction downloaded. Nothing has been sent or stored on a server.')
  }

  return <>
    <section className="project-section page-width contact-section" id="contact" aria-labelledby="contact-heading"><SectionLabel number="08">LET&apos;S MAKE IT MATTER</SectionLabel><div className="contact-grid"><div className="contact-copy"><h2 id="contact-heading">Better response<br />starts with a<br /><span className="text-primary">conversation.</span></h2><p>Are you an NGO, a responder, a researcher, or someone who believes this should exist? We&apos;d love to build with you.</p><div className="contact-invitation"><span className="status-dot" /> OPEN TO COLLABORATION & FIELD PARTNERSHIPS</div><a href="#roadmap" className="competition-link">See the project roadmap <ArrowUpRight size={15} aria-hidden="true" /></a></div><form className="contact-form" onSubmit={prepareDraft} onChange={() => { if (draft) { setDraft(''); setFeedback(''); setCopied(false) } }}><h3>Introduce yourself.</h3><p>Prepare a note for the team and connect directly through email.</p><div className="contact-links"><a href="mailto:contact.pulsewatch@gmail.com">contact.pulsewatch@gmail.com</a></div><FieldGroup><Field><FieldLabel htmlFor="contact-name">Your name</FieldLabel><Input id="contact-name" name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={100} /></Field><Field><FieldLabel htmlFor="contact-email">Email address</FieldLabel><Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="alex@organization.org" required maxLength={254} /></Field><Field><FieldLabel htmlFor="contact-message">How could we work together?</FieldLabel><Textarea id="contact-message" name="message" placeholder="Tell us a little about yourself and your ideas…" required maxLength={3000} minLength={10} rows={4} /></Field><Button type="submit" size="lg">Prepare an introduction <ArrowUpRight data-icon="inline-end" /></Button></FieldGroup>{feedback && <p className="form-feedback" role="status" aria-live="polite">{feedback}</p>}{draft && <div className="draft-actions"><Button type="button" variant="outline" onClick={copyDraft}>{copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}{copied ? 'Copied' : 'Copy message'}</Button><Button type="button" variant="outline" onClick={downloadDraft}><Download data-icon="inline-start" /> Download</Button></div>}<p className="form-feedback" role="status">{feedback}</p></form></div></section>
    <footer className="site-footer"><div className="page-width footer-main"><a className="brand" href="#" aria-label="PulseWatch home"><Activity className="brand-mark" aria-hidden="true" /><span>pulsewatch<span className="brand-period">.</span></span></a><p>Live earthquake intelligence. A clearer response.</p><a href="#" className="back-to-top">BACK TO TOP <ArrowUp size={15} aria-hidden="true" /></a></div><div className="page-width footer-bottom"><span>Designed & built by <strong>Om Prakash Pattnayak</strong>.</span><span>INDEPENDENT STUDENT PROJECT</span><span className="footer-disclaimer">Informational map. Not an emergency warning service.</span></div></footer>
  </>
}
