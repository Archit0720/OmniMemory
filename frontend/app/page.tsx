'use client'

import { useState } from 'react'
import { LandingPage } from '@/components/landing/landing-page'
import { AuthScreen } from '@/components/auth-screen'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

type View = 'landing' | 'auth' | 'app'

export default function Page() {
  const [view, setView] = useState<View>('landing')

  if (view === 'app') {
  window.location.href = '/dashboard'
  return null
}

  if (view === 'auth') {
    return (
      <AuthScreen
        onAuthenticated={() => setView('app')}
        onBack={() => setView('landing')}
      />
    )
  }

  return (
    <LandingPage
      onGetStarted={() => setView('auth')}
      onLogin={() => setView('auth')}
    />
  )
}
