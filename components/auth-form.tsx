'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError('')
    const form = new FormData(event.currentTarget)
    const result = mode === 'sign-in'
      ? await signIn.email({ email: String(form.get('email')), password: String(form.get('password')) })
      : await signUp.email({ name: String(form.get('name')), email: String(form.get('email')), password: String(form.get('password')) })
    setPending(false)
    if (result.error) { setError('Unable to authenticate with those details.'); return }
    router.push('/dashboard'); router.refresh()
  }

  return <form onSubmit={submit} className="auth-form">
    {mode === 'sign-up' && <label>Name<input name="name" required autoComplete="name" /></label>}
    <label>Email<input name="email" type="email" required autoComplete="email" /></label>
    <label>Password<input name="password" type="password" minLength={8} required autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} /></label>
    {error && <p role="alert">{error}</p>}
    <button type="submit" disabled={pending}>{pending ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
  </form>
}
