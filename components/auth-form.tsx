'use client'

import { FormEvent, useState } from 'react'
import { signIn, signUp } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    try {
      const result = mode === 'sign-in'
        ? await signIn.email({ email, password })
        : await signUp.email({ name: String(form.get('name')).trim(), email, password })
      if (result.error) {
        console.error('[v0] Authentication failed:', result.error)
        setError('Unable to authenticate with those details. Check your email and password, then try again.')
        return
      }
      window.location.assign('/dashboard')
    } catch (authError) {
      console.error('[v0] Authentication request failed:', authError)
      setError('Authentication is temporarily unavailable. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return <form onSubmit={submit} className="auth-form">
    {mode === 'sign-up' && <label>Name<input name="name" required autoComplete="name" /></label>}
    <label>Email<input name="email" type="email" required autoComplete="email" /></label>
    <label>Password<input name="password" type="password" minLength={8} required autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} /></label>
    {error && <p role="alert">{error}</p>}
    <button type="submit" disabled={pending}>{pending ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
  </form>
}
