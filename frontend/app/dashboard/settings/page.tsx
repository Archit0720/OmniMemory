'use client'

import { useEffect, useState } from 'react'
import {
  Bell,
  CheckCircle2,
  Database,
  Download,
  KeyRound,
  Loader2,
  Moon,
  Palette,
  Save,
  Settings,
  Shield,
  Sun,
  Trash2,
  User,
} from 'lucide-react'

import { getDashboardStats } from '@/lib/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Stats {
  total_memories: number
  ready_memories: number
  processing_memories: number
}

export default function SettingsPage() {
  const [name, setName] = useState('Archit')
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const [stats, setStats] = useState<Stats>({
    total_memories: 0,
    ready_memories: 0,
    processing_memories: 0,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSettingsData() {
      const token = localStorage.getItem('token')

      if (!token) {
        setError('Your session has expired. Please log in again.')
        setLoading(false)
        return
      }

      try {
        const response = await getDashboardStats(token)
        setStats(response)

        const storedName = localStorage.getItem('omni_name')
        const storedEmail = localStorage.getItem('omni_email')
        const storedNotifications = localStorage.getItem(
          'omni_notifications'
        )
        const storedCompactMode = localStorage.getItem(
          'omni_compact_mode'
        )
        const storedTheme = localStorage.getItem('omni_theme')

        if (storedName) setName(storedName)
        if (storedEmail) setEmail(storedEmail)

        if (storedNotifications !== null) {
          setNotifications(storedNotifications === 'true')
        }

        if (storedCompactMode !== null) {
          setCompactMode(storedCompactMode === 'true')
        }

        if (storedTheme === 'light' || storedTheme === 'dark') {
          setTheme(storedTheme)
        }
      } catch (settingsError) {
        console.error(settingsError)
        setError('Failed to load settings.')
      } finally {
        setLoading(false)
      }
    }

    loadSettingsData()
  }, [])

  async function handleSave() {
    try {
      setSaving(true)
      setSaved(false)

      localStorage.setItem('omni_name', name)
      localStorage.setItem('omni_email', email)
      localStorage.setItem(
        'omni_notifications',
        String(notifications)
      )
      localStorage.setItem(
        'omni_compact_mode',
        String(compactMode)
      )
      localStorage.setItem('omni_theme', theme)

      document.documentElement.classList.toggle(
        'dark',
        theme === 'dark'
      )

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      )

      setSaved(true)

      window.setTimeout(() => {
        setSaved(false)
      }, 2200)
    } finally {
      setSaving(false)
    }
  }

  function exportPreferences() {
    const payload = {
      profile: {
        name,
        email,
      },
      preferences: {
        notifications,
        compactMode,
        theme,
      },
      memoryStats: stats,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      {
        type: 'application/json',
      }
    )

    const url = URL.createObjectURL(blob)

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'omnimemory-settings.json'
    anchor.click()

    URL.revokeObjectURL(url)
  }

  function clearLocalPreferences() {
    const confirmed = window.confirm(
      'Clear saved preferences from this device?'
    )

    if (!confirmed) return

    localStorage.removeItem('omni_name')
    localStorage.removeItem('omni_email')
    localStorage.removeItem('omni_notifications')
    localStorage.removeItem('omni_compact_mode')
    localStorage.removeItem('omni_theme')

    setName('Archit')
    setEmail('')
    setNotifications(true)
    setCompactMode(false)
    setTheme('dark')

    document.documentElement.classList.add('dark')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="omni-float-one absolute -left-40 top-10 size-[480px] rounded-full bg-blue-500/20 blur-[130px]" />

        <div className="omni-float-two absolute right-[-160px] top-[22%] size-[440px] rounded-full bg-violet-500/20 blur-[130px]" />

        <div className="omni-float-three absolute bottom-[-160px] left-[38%] size-[420px] rounded-full bg-cyan-500/15 blur-[120px]" />

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
        <section className="mb-8">
          <Badge
            variant="secondary"
            className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1"
          >
            <Settings className="mr-1.5 size-3.5 text-primary" />
            Workspace preferences
          </Badge>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Manage your profile, interface preferences and local
            OmniMemory workspace settings.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <Card className="border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl">
            <CardContent className="flex min-h-[420px] flex-col items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary" />

              <p className="mt-4 font-medium">
                Loading settings...
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <User className="size-5 text-primary" />
                    </span>

                    <div>
                      <CardTitle>
                        Profile
                      </CardTitle>

                      <CardDescription className="mt-2">
                        Personalize how Omni addresses you.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Display name
                    </label>

                    <input
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Your name"
                      className="mt-2 h-12 w-full rounded-xl border border-border/70 bg-background/70 px-4 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Email
                    </label>

                    <input
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      type="email"
                      className="mt-2 h-12 w-full rounded-xl border border-border/70 bg-background/70 px-4 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10">
                      <Palette className="size-5 text-violet-400" />
                    </span>

                    <div>
                      <CardTitle>
                        Appearance
                      </CardTitle>

                      <CardDescription className="mt-2">
                        Control the look and density of your workspace.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div>
                    <p className="text-sm font-medium">
                      Theme
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                          theme === 'dark'
                            ? 'border-primary/40 bg-primary/10'
                            : 'border-border/60 bg-background/40 hover:border-primary/25'
                        }`}
                      >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-background/60">
                          <Moon className="size-4" />
                        </span>

                        <div>
                          <p className="font-medium">
                            Dark
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Recommended for Omni
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                          theme === 'light'
                            ? 'border-primary/40 bg-primary/10'
                            : 'border-border/60 bg-background/40 hover:border-primary/25'
                        }`}
                      >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-background/60">
                          <Sun className="size-4" />
                        </span>

                        <div>
                          <p className="font-medium">
                            Light
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Brighter workspace
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <SettingToggle
                    title="Compact mode"
                    description="Reduce spacing in memory lists and cards."
                    checked={compactMode}
                    onChange={setCompactMode}
                  />
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                      <Bell className="size-5 text-emerald-400" />
                    </span>

                    <div>
                      <CardTitle>
                        Notifications
                      </CardTitle>

                      <CardDescription className="mt-2">
                        Control future memory reminders and alerts.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <SettingToggle
                    title="Enable notifications"
                    description="Allow Omni to show memory and processing updates."
                    checked={notifications}
                    onChange={setNotifications}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {saved && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                    <CheckCircle2 className="size-4" />
                    Preferences saved
                  </div>
                )}

                <Button
                  className="rounded-xl"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Save settings
                    </>
                  )}
                </Button>
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="size-5 text-primary" />
                    Storage overview
                  </CardTitle>

                  <CardDescription>
                    Current memory workspace usage.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <StatRow
                    label="Total memories"
                    value={stats.total_memories}
                  />

                  <StatRow
                    label="Ready"
                    value={stats.ready_memories}
                  />

                  <StatRow
                    label="Processing"
                    value={stats.processing_memories}
                  />

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Memory health
                      </span>

                      <span className="font-semibold">
                        {stats.total_memories === 0
                          ? 0
                          : Math.round(
                              (stats.ready_memories /
                                stats.total_memories) *
                                100
                            )}
                        %
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${
                            stats.total_memories === 0
                              ? 0
                              : (stats.ready_memories /
                                  stats.total_memories) *
                                100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="size-5 text-primary" />
                    Privacy
                  </CardTitle>

                  <CardDescription>
                    Your memories remain associated with your account.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <div className="flex items-start gap-3">
                      <KeyRound className="mt-0.5 size-4 text-primary" />

                      <p className="text-sm leading-6 text-muted-foreground">
                        Authentication protects access to your personal memory
                        space and API requests.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={exportPreferences}
                  >
                    <Download className="mr-2 size-4" />
                    Export settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-500/20 bg-red-500/[0.04] shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-red-300">
                    <Trash2 className="size-5" />
                    Local preferences
                  </CardTitle>

                  <CardDescription>
                    Clear settings saved in this browser only.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-red-500/20 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    onClick={clearLocalPreferences}
                  >
                    Clear local settings
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-border/60 bg-background/40 p-4">
      <div>
        <p className="font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function StatRow({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  )
}