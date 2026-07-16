'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Activity,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Network,
  Settings,
  Upload,
  X,
} from 'lucide-react'

import { OmniLogo } from '@/components/omni-logo'
import { cn } from '@/lib/utils'

const nav = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Feed Memory',
    href: '/dashboard/feed',
    icon: Upload,
  },
  {
    label: 'Ask Omni',
    href: '/dashboard/ask',
    icon: MessageSquareText,
  },
  {
    label: 'Activity',
    href: '/dashboard/activity',
    icon: Activity,
  },
  {
    label: 'Knowledge Graph',
    href: '/dashboard/graph',
    icon: Network,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface AppSidebarProps {
  onLogout: () => void
  mobile?: boolean
  onClose?: () => void
}

export function AppSidebar({
  onLogout,
  mobile = false,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'shrink-0 p-3',
        mobile
          ? 'h-full w-[290px]'
          : 'relative z-30 hidden w-64 lg:block'
      )}
    >
      <div
        className={cn(
          'relative flex flex-col overflow-hidden rounded-3xl border border-sidebar-border/70 bg-sidebar/95 p-4 shadow-2xl backdrop-blur-xl',
          mobile
            ? 'h-full'
            : 'sticky top-3 h-[calc(100vh-24px)]'
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/5 via-transparent to-violet-500/5" />

        <div className="relative px-2 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <OmniLogo />

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Your personal AI memory system
              </p>
            </div>

            {mobile && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        <nav className="relative mt-5 flex flex-1 flex-col gap-1.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === href
                : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/12 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                )}

                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-xl transition',
                    isActive
                      ? 'bg-primary/15'
                      : 'bg-background/30 group-hover:bg-background/60'
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>

                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="relative space-y-3">
          <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">
                Memory engine
              </p>

              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Online and ready
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-background/30">
              <LogOut className="size-[18px]" />
            </span>

            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}