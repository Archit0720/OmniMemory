'use client'

import { ArrowRight } from 'lucide-react'
import { GithubIcon } from '@/components/github-icon'
import { OmniLogo } from '@/components/omni-logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Documentation', href: '#' },
  { label: 'Privacy', href: '#' },
]

export function SiteFooter({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <footer className="relative px-4 pb-10 pt-12">
      <div className="mx-auto max-w-6xl">
        {/* CTA band */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 px-6 py-14 text-center backdrop-blur">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 size-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
          />
          <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Start remembering everything.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Build your AI-powered second brain today. Free to get started.
          </p>
          <Button size="lg" className="relative mt-8" onClick={onGetStarted}>
            Get Started
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <OmniLogo />

          <nav className="flex items-center gap-6">
            {footerLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label === 'GitHub' && <GithubIcon />}
                {l.label}
              </a>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">
            {`© ${new Date().getFullYear()} OmniMemory`}
          </p>
        </div>
      </div>
    </footer>
  )
}
