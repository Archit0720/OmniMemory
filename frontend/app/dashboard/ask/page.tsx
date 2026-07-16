'use client'

import { useState } from 'react'
import {
  ArrowUp,
  Brain,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  MessageSquareText,
  Search,
  Sparkles,
} from 'lucide-react'

import { askOmni } from '@/lib/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Source {
  memory_id: number | string
  title?: string
  summary?: string
  text?: string
  score?: number
  memory_type?: string
  source_type?: string
  products?: string[]
  dates?: string[]
  topics?: string[]
}

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

const suggestions = [
  'What did I buy today?',
  'Show me my recent receipts',
  'What warranties do I have?',
  'Summarize my latest memories',
]

export default function AskOmniPage() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [expandedSource, setExpandedSource] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleAsk(customQuestion?: string) {
    const finalQuestion = customQuestion ?? question

    if (!finalQuestion.trim() || loading) return

    const token = localStorage.getItem('token')

    if (!token) {
      setError('Your session has expired. Please log in again.')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: finalQuestion.trim(),
    }

    setMessages((previous) => [...previous, userMessage])
    setQuestion('')
    setError('')
    setLoading(true)
    setLoadingStep('Searching semantic memory...')

    const stepTwo = window.setTimeout(() => {
      setLoadingStep('Checking metadata and dates...')
    }, 700)

    const stepThree = window.setTimeout(() => {
      setLoadingStep('Following related memories...')
    }, 1400)

    const stepFour = window.setTimeout(() => {
      setLoadingStep('Generating your answer...')
    }, 2100)

    try {
      const response = await askOmni(finalQuestion.trim(), token)

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          response.answer ||
          "I couldn't find this information in your memories.",
        sources: response.sources || [],
      }

      setMessages((previous) => [...previous, assistantMessage])
    } catch (askError) {
      console.error(askError)

      setError('Omni could not answer right now. Please try again.')
    } finally {
      window.clearTimeout(stepTwo)
      window.clearTimeout(stepThree)
      window.clearTimeout(stepFour)

      setLoading(false)
      setLoadingStep('')
    }
  }

  function clearConversation() {
    setMessages([])
    setQuestion('')
    setError('')
    setExpandedSource(null)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="omni-float-one absolute -left-40 top-10 size-[480px] rounded-full bg-blue-500/20 blur-[130px]" />

        <div className="omni-float-two absolute right-[-160px] top-[20%] size-[440px] rounded-full bg-violet-500/20 blur-[130px]" />

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

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 lg:px-8">
        {/* Header */}
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1"
            >
              <Sparkles className="mr-1.5 size-3.5 text-primary" />
              Memory intelligence
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Ask Omni
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Search across your memories, documents, receipts, images and
              connected knowledge.
            </p>
          </div>

          {messages.length > 0 && (
            <Button
              variant="outline"
              className="w-fit rounded-xl"
              onClick={clearConversation}
              disabled={loading}
            >
              New conversation
            </Button>
          )}
        </section>

        {/* Main workspace */}
        <Card className="relative flex min-h-[680px] flex-1 flex-col overflow-hidden border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10" />

          <CardHeader className="relative border-b border-border/60">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
                <Brain className="size-5 text-primary" />
              </span>

              <div>
                <CardTitle className="text-lg">
                  Omni conversation
                </CardTitle>

                <CardDescription>
                  Answers are grounded only in your saved memories.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative flex flex-1 flex-col p-0">
            {/* Empty state */}
            {messages.length === 0 && !loading && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                <span className="flex size-20 items-center justify-center rounded-3xl border border-primary/15 bg-primary/10 shadow-xl shadow-primary/10">
                  <MessageSquareText className="size-9 text-primary" />
                </span>

                <h2 className="mt-7 text-2xl font-semibold">
                  What would you like to remember?
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                  Ask about purchases, documents, people, dates, warranties,
                  meetings or anything else you have saved.
                </p>

                <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleAsk(suggestion)}
                      className="group rounded-2xl border border-border/60 bg-background/50 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Search className="size-4 text-primary" />
                        </span>

                        <div>
                          <p className="text-sm font-medium">
                            {suggestion}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Ask Omni
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation */}
            {messages.length > 0 && (
              <div className="flex-1 space-y-8 overflow-y-auto px-5 py-8 sm:px-8">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="max-w-[88%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground shadow-lg shadow-primary/10 sm:max-w-[70%]">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
                          <Brain className="size-5 text-primary" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="rounded-2xl rounded-tl-md border border-border/60 bg-background/65 p-5 shadow-sm">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <p className="font-semibold">
                                Omni
                              </p>

                              <Badge
                                variant="secondary"
                                className="rounded-full text-[10px]"
                              >
                                Grounded answer
                              </Badge>
                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                              {message.content}
                            </p>
                          </div>

                          {/* Sources */}
                          {message.sources &&
                            message.sources.length > 0 && (
                              <div className="mt-4">
                                <div className="mb-3 flex items-center gap-2">
                                  <FileText className="size-4 text-primary" />

                                  <p className="text-sm font-semibold">
                                    Sources
                                  </p>

                                  <Badge
                                    variant="outline"
                                    className="rounded-full text-[10px]"
                                  >
                                    {message.sources.length}
                                  </Badge>
                                </div>

                                <div className="space-y-3">
                                  {message.sources.map(
                                    (source, index) => {
                                      const sourceKey = `${message.id}-${source.memory_id}-${index}`

                                      const score = Math.max(
                                        0,
                                        Math.min(
                                          Number(source.score || 0) * 100,
                                          100
                                        )
                                      )

                                      const isExpanded =
                                        expandedSource === sourceKey

                                      const relevance =
                                        score >= 80
                                          ? 'Excellent match'
                                          : score >= 60
                                            ? 'Strong match'
                                            : score >= 40
                                              ? 'Relevant'
                                              : 'Possible match'

                                      return (
                                        <div
                                          key={sourceKey}
                                          className="overflow-hidden rounded-2xl border border-border/60 bg-background/50"
                                        >
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setExpandedSource(
                                                isExpanded
                                                  ? null
                                                  : sourceKey
                                              )
                                            }
                                            className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-primary/[0.03]"
                                          >
                                            <div className="flex min-w-0 items-start gap-3">
                                              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                                <FileText className="size-4 text-primary" />
                                              </span>

                                              <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                  {source.title ||
                                                    'Untitled memory'}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                  {relevance}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-3">
                                              <Badge
                                                variant="secondary"
                                                className="rounded-full"
                                              >
                                                {score.toFixed(0)}%
                                              </Badge>

                                              {isExpanded ? (
                                                <ChevronUp className="size-4 text-muted-foreground" />
                                              ) : (
                                                <ChevronDown className="size-4 text-muted-foreground" />
                                              )}
                                            </div>
                                          </button>

                                          <div className="px-4 pb-3">
                                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                              <div
                                                className="h-full rounded-full bg-primary transition-all duration-700"
                                                style={{
                                                  width: `${score}%`,
                                                }}
                                              />
                                            </div>
                                          </div>

                                          {isExpanded && (
                                            <div className="border-t border-border/50 p-4">
                                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Matched information
                                              </p>

                                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                                                {source.summary ||
                                                  source.text ||
                                                  'No preview available.'}
                                              </p>

                                              <div className="mt-4 flex flex-wrap gap-2">
                                                {source.memory_type && (
                                                  <Badge
                                                    variant="secondary"
                                                    className="rounded-full"
                                                  >
                                                    {source.memory_type}
                                                  </Badge>
                                                )}

                                                {(source.topics || [])
                                                  .slice(0, 3)
                                                  .map((topic) => (
                                                    <Badge
                                                      key={topic}
                                                      variant="outline"
                                                      className="rounded-full"
                                                    >
                                                      {topic}
                                                    </Badge>
                                                  ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking state */}
                {loading && (
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
                      <Brain className="size-5 animate-pulse text-primary" />
                    </span>

                    <div className="rounded-2xl rounded-tl-md border border-border/60 bg-background/65 p-5">
                      <div className="flex items-center gap-3">
                        <Loader2 className="size-4 animate-spin text-primary" />

                        <p className="text-sm font-medium">
                          {loadingStep}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-1.5">
                        <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                        <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                        <span className="size-2 animate-bounce rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mx-5 mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:mx-8">
                {error}
              </div>
            )}

            {/* Composer */}
            <div className="border-t border-border/60 bg-background/55 p-4 backdrop-blur-xl sm:p-5">
              <div className="mx-auto max-w-4xl rounded-2xl border border-border/70 bg-background/80 p-3 shadow-xl transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
                <Textarea
                  value={question}
                  onChange={(event) =>
                    setQuestion(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      !event.shiftKey
                    ) {
                      event.preventDefault()
                      handleAsk()
                    }
                  }}
                  placeholder="Ask anything about your memories..."
                  className="min-h-[74px] resize-none border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
                  disabled={loading}
                />

                <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-3">
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Enter to ask · Shift + Enter for a new line
                  </p>

                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleAsk()}
                    disabled={loading || !question.trim()}
                    className="ml-auto size-10 rounded-xl"
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowUp className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}