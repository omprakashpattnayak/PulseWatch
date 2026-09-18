import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export default function SignUpPage() { return <main className="auth-page"><div className="auth-card"><p className="eyebrow">PULSEWATCH</p><h1>Build your watchlist.</h1><p>Create an account to save regions and configure alert rules.</p><AuthForm mode="sign-up" /><Link href="/sign-in">Already have an account?</Link></div></main> }
