'use client'

import { GithubIcon } from '@/components/github-icon'
import { OmniLogo } from '@/components/omni-logo'
import { Button } from '@/components/ui/button'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
]

export function LandingNav({ onLogin }: { onLogin: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-5xl items-center gap-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-2.5 shadow-lg shadow-black/20 backdrop-blur-xl">
        <OmniLogo />

        <div className="mx-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon />
            GitHub
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Button variant="ghost" size="sm" onClick={onLogin}>
            Login
          </Button>
          <Button size="sm" onClick={onLogin}>
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  )
}
