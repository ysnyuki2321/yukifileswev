export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { demo?: string; scenario?: string; quick?: string; full?: string }
}) {
  // Check if this is a demo request
  if (searchParams.demo === 'true') {
    // Redirect to comprehensive demo dashboard
    redirect('/demo/dashboard')
  }

  return <DashboardClient />
}
