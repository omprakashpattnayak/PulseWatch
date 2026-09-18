'use client'

import { useState, type FormEvent } from 'react'
import { Activity, ArrowUp, ArrowUpRight, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SectionLabel } from '@/components/project-sections'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = 'e4cdc6ee-87f0-43cb-b23b-06c878948400'

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('')

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
      subject: 'New PulseWatch collaboration message',
      from_name: 'PulseWatch contact form',
    }

    setIsSubmitting(true)
    setFeedback('')
    setFeedbackType('')

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error('Unable to send message')
      form.reset()
      setFeedback('Your message has been sent.')
      setFeedbackType('success')
    } catch {
      setFeedback('We could not send your message. Please try again.')
      setFeedbackType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <>
    <section className="project-section page-width contact-section" id="contact" aria-labelledby="contact-heading">
      <SectionLabel number="08">LET&apos;S MAKE IT MATTER</SectionLabel>
      <div className="contact-grid">
        <div className="contact-copy">
          <h2 id="contact-heading">Better response<br />starts with a<br /><span className="text-primary">conversation.</span></h2>
          <p>Are you an NGO, a responder, a researcher, or someone who believes this should exist? We&apos;d love to build with you.</p>
          <div className="contact-invitation"><span className="status-dot" /> OPEN TO COLLABORATION &amp; FIELD PARTNERSHIPS</div>
          <a href="#roadmap" className="competition-link">See the project roadmap <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <h3>Introduce yourself.</h3>
          <p>Send a message directly to the PulseWatch team. We&apos;ll only use your details to respond to this inquiry.</p>
          <FieldGroup>
            <Field><FieldLabel htmlFor="contact-name">Your name</FieldLabel><Input id="contact-name" name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={100} /></Field>
            <Field><FieldLabel htmlFor="contact-email">Email address</FieldLabel><Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="alex@organization.org" required maxLength={254} /></Field>
            <Field><FieldLabel htmlFor="contact-message">How could we work together?</FieldLabel><Textarea id="contact-message" name="message" placeholder="Tell us a little about yourself and your ideas…" required maxLength={3000} minLength={10} rows={4} /></Field>
            <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="contact-spinner" size={16} aria-hidden="true" /> Sending…</> : <>Send message <ArrowUpRight data-icon="inline-end" /></>}</Button>
          </FieldGroup>
          {feedback && <p className={`form-feedback form-feedback-${feedbackType}`} role={feedbackType === 'error' ? 'alert' : 'status'} aria-live="polite">{feedback}</p>}
        </form>
      </div>
    </section>
    <footer className="site-footer"><div className="page-width footer-main"><a className="brand" href="#" aria-label="PulseWatch home"><Activity className="brand-mark" aria-hidden="true" /><span>pulsewatch<span className="brand-period">.</span></span></a><p>One planet. Every signal. A better response.</p><a href="#" className="back-to-top">BACK TO TOP <ArrowUp size={15} aria-hidden="true" /></a></div><div className="page-width footer-bottom"><span>Designed &amp; built by <strong>Om Prakash Pattnayak</strong>.</span><span>INDEPENDENT STUDENT PROJECT</span><span className="footer-disclaimer">Informational platform. Not an emergency warning service.</span></div></footer>
  </>
}
