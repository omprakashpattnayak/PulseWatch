import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

const authSecret = process.env.BETTER_AUTH_SECRET?.trim() ||
  (process.env.NEXT_PHASE === 'phase-production-build' ? 'build-only-placeholder-never-used-at-runtime' : '')
if (!authSecret || authSecret === 'build-only-placeholder-never-used-at-runtime') {
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('BETTER_AUTH_SECRET is missing. Configure it in the Vercel project environment before starting the app.')
  }
}

const authURL = (
  process.env.BETTER_AUTH_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  process.env.V0_RUNTIME_URL?.trim() ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') ||
  (process.env.NEXT_PHASE === 'phase-production-build' ? 'https://build.invalid' : '')
).replace(/\/$/, '')

if (!authURL || authURL === 'https://build.invalid') {
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('Better Auth URL is missing. Set BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL in the Vercel project environment.')
  }
}

const configuredOrigins = [
  authURL,
  ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
  ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
  ...(process.env.V0_DEV_APP_URL ? [process.env.V0_DEV_APP_URL] : []),
  ...(process.env.V0_BUILD_URL ? [process.env.V0_BUILD_URL] : []),
  ...(process.env.V0_SANDBOX_URL ? [process.env.V0_SANDBOX_URL] : []),
]

export const auth = betterAuth({
  database: pool,
  secret: authSecret,
  baseURL: authURL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: [
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
    ...configuredOrigins,
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
