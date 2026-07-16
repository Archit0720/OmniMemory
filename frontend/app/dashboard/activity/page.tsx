'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Brain,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Upload,
} from 'lucide-react'

import { getMemories } from '@/lib/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Memory {
  id: number
  title?: string
  summary?: string
  memory_type?: string
  source_type?: string
  status?: string
  created_at?: string
  updated_at?: string
  topics?: string[]
  keywords?: string[]
}

function getMemoryIcon(sourceType?: string) {
  return String(sourceType || '').toLowerCase() === 'image'
    ? ImageIcon
    : FileText
}

function formatDate(value?: string) {
  if (!value) {
    return 'Unknown date'
  }

  return new Date(value).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(value?: string) {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ActivityPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  async function loadActivity() {
    const token = localStorage.getItem('token')

    if (!token) {
      setError('Your session has expired. Please log in again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getMemories(token)

      setMemories(
        [...response].sort((a, b) => {
          const first = new Date(
            b.updated_at || b.created_at || 0
          ).getTime()

          const second = new Date(
            a.updated_at || a.created_at || 0
          ).getTime()

          return first - second
        })
      )
    } catch (activityError) {
      console.error(activityError)
      setError('Failed to load activity.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivity()
  }, [])

  const filteredMemories = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return memories
    }

    return memories.filter((memory) => {
      const searchable = [
        memory.title,
        memory.summary,
        memory.memory_type,
        memory.source_type,
        ...(memory.topics || []),
        ...(memory.keywords || []),
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(query)
    })
  }, [memories, search])

  const groupedMemories = useMemo(() => {
    return filteredMemories.reduce<Record<string, Memory[]>>(
      (groups, memory) => {
        const key = formatDate(
          memory.updated_at || memory.created_at
        )

        if (!groups[key]) {
          groups[key] = []
        }

        groups[key].push(memory)

        return groups
      },
      {}
    )
  }, [filteredMemories])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="omni-float-one absolute -left-40 top-10 size-[480px] rounded-full bg-blue-500/20 blur-[130px]" />

        <div className="omni-float-two absolute right-[-160px] top-[22%] size-[440px] rounded-full bg-violet-500/20 blur-[130px]" />

        <div className="omni-float-three absolute bottom-[-160px] left-[35%] size-[420px] rounded-full bg-cyan-500/15 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1"
            >
              <Activity className="mr-1.5 size-3.5 text-primary" />
              Memory timeline
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Activity
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Review when memories were created, processed and updated across
              your personal knowledge base.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activity..."
                className="h-11 w-full rounded-xl border border-border/70 bg-background/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:w-72"
              />
            </div>

            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={loadActivity}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 size-4 ${
                  loading ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </Button>
          </div>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Upload className="size-5 text-primary" />
                </span>

                <Badge variant="outline" className="rounded-full">
                  Total
                </Badge>
              </div>

              <p className="mt-6 text-3xl font-semibold">
                {memories.length}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Memory events
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <Brain className="size-5 text-emerald-400" />
                </span>

                <Badge variant="outline" className="rounded-full">
                  Ready
                </Badge>
              </div>

              <p className="mt-6 text-3xl font-semibold">
                {
                  memories.filter(
                    (memory) => memory.status === 'READY'
                  ).length
                }
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Searchable memories
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-500/10">
                  <CalendarDays className="size-5 text-violet-400" />
                </span>

                <Badge variant="outline" className="rounded-full">
                  Days
                </Badge>
              </div>

              <p className="mt-6 text-3xl font-semibold">
                {Object.keys(groupedMemories).length}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Active dates
              </p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <Card className="overflow-hidden border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-5 text-primary" />
              Memory history
            </CardTitle>

            <CardDescription>
              Newest activity appears first.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />

                <p className="mt-4 font-medium">
                  Loading your timeline...
                </p>
              </div>
            ) : Object.keys(groupedMemories).length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-3xl bg-primary/10">
                  <Activity className="size-7 text-primary" />
                </span>

                <p className="mt-5 text-lg font-semibold">
                  No activity found
                </p>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Upload a memory or try another search term.
                </p>
              </div>
            ) : (
              <div className="px-5 py-7 sm:px-8">
                {Object.entries(groupedMemories).map(
                  ([date, items], groupIndex) => (
                    <section
                      key={date}
                      className={
                        groupIndex === 0
                          ? ''
                          : 'mt-10'
                      }
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                          <CalendarDays className="size-4 text-primary" />
                        </span>

                        <div>
                          <h2 className="font-semibold">
                            {date}
                          </h2>

                          <p className="text-xs text-muted-foreground">
                            {items.length} event
                            {items.length === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>

                      <div className="relative ml-4 border-l border-border/70 pl-7">
                        {items.map((memory, index) => {
                          const Icon = getMemoryIcon(
                            memory.source_type
                          )

                          return (
                            <div
                              key={memory.id}
                              className={
                                index === items.length - 1
                                  ? 'relative'
                                  : 'relative pb-7'
                              }
                            >
                              <span className="absolute -left-[36px] top-1 flex size-4 items-center justify-center rounded-full border-4 border-background bg-primary" />

                              <div className="rounded-2xl border border-border/60 bg-background/50 p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.025] hover:shadow-lg">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex min-w-0 items-start gap-4">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                                      <Icon className="size-5 text-primary" />
                                    </span>

                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold">
                                          {memory.title ||
                                            'Untitled memory'}
                                        </h3>

                                        <Badge
                                          variant="secondary"
                                          className="rounded-full text-[10px]"
                                        >
                                          {memory.memory_type ||
                                            memory.source_type ||
                                            'Memory'}
                                        </Badge>
                                      </div>

                                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {memory.summary ||
                                          'No summary available.'}
                                      </p>

                                      <div className="mt-4 flex flex-wrap gap-2">
                                        {(memory.topics || [])
                                          .slice(0, 4)
                                          .map((topic) => (
                                            <Badge
                                              key={topic}
                                              variant="outline"
                                              className="rounded-full text-[10px]"
                                            >
                                              {topic}
                                            </Badge>
                                          ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-3">
                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        memory.status === 'READY'
                                          ? 'bg-emerald-500/10 text-emerald-400'
                                          : 'bg-amber-500/10 text-amber-400'
                                      }`}
                                    >
                                      {memory.status || 'UNKNOWN'}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(
                                        memory.updated_at ||
                                          memory.created_at
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}