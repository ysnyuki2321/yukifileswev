"use client"

import { ComprehensiveDemoDashboard } from '@/components/demo/comprehensive-demo-dashboard'

export default function DemoDashboardPage() {
  return (
    <ComprehensiveDemoDashboard 
      isDemo={true}
      mode="full"
    />
  )
}