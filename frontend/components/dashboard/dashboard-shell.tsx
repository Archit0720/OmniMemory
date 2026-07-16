'use client'

import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { DashboardHome } from '@/components/dashboard/dashboard-home'

export function DashboardShell({
  onLogout,
}: {
  onLogout: () => void
}) {
  return (
    <div className="relative flex min-h-screen bg-background">
      <AppSidebar onLogout={onLogout} />

      <main className="relative z-10 min-w-0 flex-1">
        <DashboardHome />
      </main>
    </div>
  )
}