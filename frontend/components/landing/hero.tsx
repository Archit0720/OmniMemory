'use client'

import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { AiMemoryVisual } from '@/components/ai-memory-visual'
import { Button } from '@/components/ui/button'

export function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-36 lg:pt-44">
      {/* ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-40 size-96 rounded-full bg-chart-3/10 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-sm text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            AI-powered second brain
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your Second Brain, Powered by AI.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Turn documents, screenshots, notes, recordings and images into
            searchable knowledge. Ask questions naturally and let AI remember
            everything for you.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" className="w-full sm:w-auto" onClick={onGetStarted}>
              Get Started
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Play data-icon="inline-start" />
              Watch Demo
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Trusted by 40,000+ knowledge workers. No credit card required.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AiMemoryVisual />
        </div>
      </div>
    </section>
  )
}
