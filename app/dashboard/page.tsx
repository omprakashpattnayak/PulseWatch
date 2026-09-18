import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getWatchlist } from '@/app/actions/watchlist'
import { DashboardClient } from '@/components/dashboard-client'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const watchlist = await getWatchlist()
  return <DashboardClient user={{ name: session.user.name, email: session.user.email }} watchlist={watchlist} />
}
