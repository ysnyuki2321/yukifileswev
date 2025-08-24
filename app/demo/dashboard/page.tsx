"use client"

import { WorkingDemoDashboard } from '@/components/demo/working-demo-dashboard'
import { DemoAuthProvider } from '@/contexts/demo-auth-context'

export default function DemoDashboardPage() {
  return (
    <DemoAuthProvider>
      <WorkingDemoDashboard />
    </DemoAuthProvider>
  )
}