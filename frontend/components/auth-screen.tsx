'use client'

import type React from 'react'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AiMemoryVisual } from '@/components/ai-memory-visual'
import { OmniLogo } from '@/components/omni-logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { login, register } from "@/lib/api";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-.96 2.6-2.05 3.4l3.3 2.6c1.93-1.8 3.05-4.4 3.05-7.5 0-.7-.06-1.4-.18-2z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.4l-3.3-2.6c-.9.6-2.06 1-3.33 1-2.56 0-4.73-1.73-5.5-4.06l-3.4 2.6C4.98 19.98 8.24 22 12 22z"
      />
      <path
        fill="#4A90D9"
        d="M6.5 13.94A6.02 6.02 0 0 1 6.5 10L3.1 7.4A10 10 0 0 0 2 12c0 1.6.38 3.13 1.06 4.5z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.94c1.47 0 2.78.5 3.82 1.5l2.85-2.85C16.96 2.98 14.7 2 12 2 8.24 2 4.98 4.02 3.1 7.4l3.4 2.6C7.27 7.67 9.44 5.94 12 5.94z"
      />
    </svg>
  )
}

export function AuthScreen({
  onAuthenticated,
  onBack,
}: {
  onAuthenticated: () => void
  onBack: () => void
}) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {

  e.preventDefault()

  setLoading(true)
  setError("")

  try {

    if (mode === "signup") {

      await register(
        username,
        email,
        password
      )

    }

    const response = await login(
      email,
      password
    )

    localStorage.setItem(
      "token",
      response.access_token
    )

    onAuthenticated()

  }

  catch (err: any) {

    setError(err.message)

  }

  finally {

    setLoading(false)

  }

}

  return (
    <main className="relative min-h-screen w-full overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left — brand + visual */}
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 size-[36rem] rounded-full bg-primary/20 blur-[130px]"
        />
        <OmniLogo className="relative" />

        <div className="relative flex flex-1 items-center justify-center">
          <AiMemoryVisual />
        </div>

        <div className="relative max-w-sm">
          <p className="text-pretty text-xl font-medium leading-relaxed text-foreground">
            Your AI Powered Second Brain.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Retrieve anything you have ever saved using natural language.
          </p>
        </div>
      </section>

      {/* Right — auth card */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden p-6 lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 size-[30rem] rounded-full bg-chart-4/15 blur-[130px] lg:hidden"
        />
        <div className="relative w-full max-w-md">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </button>

          <div className="mb-6 lg:hidden">
            <OmniLogo />
          </div>

          <Card className="border-border/60 bg-card/70 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login'
                  ? 'Sign in to access your second brain.'
                  : 'Start building your AI powered memory.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>

                  {mode === "signup" && (
                  <Field>
                    <FieldLabel htmlFor="username">
                      Username
                    </FieldLabel>

                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                    />
                  </Field>
                )}
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                        />
                  </Field>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <button
                        type="button"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete={
                        mode === 'login'
                          ? 'current-password'
                          : 'new-password'
                      }
                      required
                    />
                  </Field>

                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                    <Checkbox id="remember" defaultChecked />
                    Remember me for 30 days
                  </label>

                  {error && (
                      <p className="text-sm text-red-500">
                        {error}
                      </p>
                    )}

                  <Button
                    type="submit"
                    className="mt-1 w-full"
                    disabled={loading}
                  >
                    {loading
                      ? "Please wait..."
                      : mode === "login"
                      ? "Login"
                      : "Create Account"}

                    <ArrowRight data-icon="inline-end" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login")
                      setUsername("")
                      setEmail("")
                      setPassword("")
                      setError("")
                    }}
                  >
                    {mode === 'login' ? 'Create Account' : 'Back to Login'}
                  </Button>

                  <div className="flex items-center gap-3 py-1">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">
                      OR
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  <Button type="button" variant="outline" className="w-full">
                    <GoogleIcon />
                    Continue with Google
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
