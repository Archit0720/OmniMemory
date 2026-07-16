'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'

import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { OmniLogo } from '@/components/omni-logo'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  function handleLogout() {
    localStorage.removeItem('token')
    router.push('/')
  }

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen
      ? 'hidden'
      : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <AppSidebar onLogout={handleLogout} />

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative h-full w-fit animate-in slide-in-from-left duration-300">
            <AppSidebar
              mobile
              onLogout={handleLogout}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:hidden">
          <OmniLogo />

          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          >
            <Menu className="size-5" />
          </button>
        </header>

        <main className="relative z-10 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}