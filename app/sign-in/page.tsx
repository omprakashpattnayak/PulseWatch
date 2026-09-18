import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export default function SignInPage() { return <main className="auth-page"><div className="auth-card"><p className="eyebrow">PULSEWATCH</p><h1>Welcome back.</h1><p>Sign in to manage saved regions and alert rules.</p><AuthForm mode="sign-in" /><Link href="/sign-up">Create an account</Link></div></main> }
