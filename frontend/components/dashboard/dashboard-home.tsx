'use client'

import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Brain,
  Database,
  FileText,
  HardDrive,
  Image as ImageIcon,
  MessageSquareText,
  Mic,
  TrendingUp,
  Upload,
  Trash2,
} from 'lucide-react'

import {
  askOmni,
  uploadMemory,
  getMemories,
  getDashboardStats,
  deleteMemory,
  getMemory,
  searchMemories,
  updateMemory,
  uploadPdf,
  uploadImage
} from '@/lib/api'



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



export function DashboardHome() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [memories, setMemories] = useState<any[]>([])
  const [selectedMemory, setSelectedMemory] = useState<any>(null)
  const [showMemory, setShowMemory] = useState(false)
  const [search, setSearch] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editText, setEditText] = useState("")
  const [saving, setSaving] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [sources, setSources] = useState<any[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [stats, setStats] = useState({
    total_memories: 0,
    ready_memories: 0,
    processing_memories: 0,
  })

  const [memoryTitle, setMemoryTitle] = useState("")
  const [memoryText, setMemoryText] = useState("")
  const [uploading, setUploading] = useState(false)

  async function handleAsk() {
    if (!question.trim()) return

    setAnswer("")
    setSources([])

    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        alert("Please login again.")
        return
      }

     const response = await askOmni(question, token)
     

    setAnswer(response.answer)
    setSources(response.sources || [])
    } catch (err) {
      console.error(err)
      alert("Failed to get response.")
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    try {
      const token = localStorage.getItem("token")

      if (!token) return

      const response = await getDashboardStats(token)

      setStats(response)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadMemories() {

      const token = localStorage.getItem("token")

      if (!token) return

      try {

        const data = await getMemories(token)

        setMemories(data)

      }

      catch (err) {

        console.error(err)

      }

    }

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {

    

    loadMemories()

  }, [])

  async function handleUpload() {

    if (!pdfFile && !imageFile && (!memoryTitle.trim() || !memoryText.trim())) {
      alert("Please provide text or choose a PDF.")
      return
    }

    setUploading(true)

    try {

      const token = localStorage.getItem("token")

      if (!token) {
        alert("Please login again.")
        return
      }

      if (pdfFile) {

              await uploadPdf(
                  pdfFile,
                  token
              )

          } else if (imageFile) {

              await uploadImage(
                  imageFile,
                  token
              )

          } else {

              await uploadMemory(
                  memoryTitle,
                  memoryText,
                  token
              )

          }

      await loadMemories()
      await loadStats()

      alert("Memory uploaded successfully!")

      setMemoryTitle("")
      setMemoryText("")
      setPdfFile(null)
      setImageFile(null)

    } catch (err) {

      console.error(err)
      alert("Upload failed.")

    } finally {

      setUploading(false)

    }

  }

  async function handleSearch(value: string) {

  setSearch(value)

  const token = localStorage.getItem("token")

  if (!token) return

  if (value.trim() === "") {
    loadMemories()
    return
  }

  try {

    const data = await searchMemories(
      value,
      token
    )

    setMemories(data)

  } catch (err) {

    console.error(err)

  }

}

  async function handleDelete(memoryId: number) {

  const ok = confirm(
    "Delete this memory?"
  )

  if (!ok) return

  try {

    const token = localStorage.getItem("token")

    if (!token) return

    await deleteMemory(
      memoryId,
      token
    )

    await loadMemories()
    await loadStats()

    setMemories(prev =>
      prev.filter(m => m.id !== memoryId)
    )

    loadStats()

  }



  catch (err) {

    console.error(err)
    alert("Delete failed.")

  }

}

async function handleSaveEdit() {

  if (!selectedMemory) return

  try {

    setSaving(true)

    const token = localStorage.getItem("token")

    if (!token) return

    const updated = await updateMemory(
      selectedMemory.id,
      editTitle,
      editText,
      token
    )

    setSelectedMemory(updated)
    setEditTitle(updated.title)
    setEditText(updated.text)

    await loadMemories()
    await loadStats()

    setEditMode(false)

    const refreshed = await getMemory(
    updated.id,
    token
)

setSelectedMemory(refreshed)

  } catch (err) {

    console.error(err)

    alert("Update failed.")

  } finally {

    setSaving(false)

  }

}


async function handleView(memoryId: number) {

  try {

    const token = localStorage.getItem("token")

    if (!token) return

    const memory = await getMemory(
      memoryId,
      token
    )

    setSelectedMemory(memory)
    setEditTitle(memory.title)
    setEditText(memory.text)

    setEditMode(false)

    setShowMemory(true)

  }

  catch (err) {

    console.error(err)

    alert("Unable to load memory.")

  }

}

  const dashboardCards = [
  {
    label: "Total Memories",
    value: stats.total_memories,
    icon: Database,
  },
  {
    label: "Ready",
    value: stats.ready_memories,
    icon: Brain,
  },
  {
    label: "Processing",
    value: stats.processing_memories,
    icon: Upload,
  },
]

  return (

     <div className="relative min-h-screen overflow-hidden">

      
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
  <div className="absolute inset-0 bg-background" />

  <div className="omni-float-one absolute -left-32 top-10 size-[480px] rounded-full bg-blue-500/25 blur-[130px]" />

  <div className="omni-float-two absolute right-[-140px] top-[22%] size-[440px] rounded-full bg-violet-500/25 blur-[130px]" />

  <div className="omni-float-three absolute bottom-[-140px] left-[35%] size-[420px] rounded-full bg-cyan-500/20 blur-[120px]" />

  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage:
        "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />
</div>

    {/* Actual dashboard content */}
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 lg:px-8">

      {/* Ask Omni Hero */}

<section className="relative mb-8 overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-1 shadow-2xl backdrop-blur-xl">
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10" />

  <div className="relative rounded-[22px] bg-background/50 px-5 py-8 sm:px-8 sm:py-10">
    <div className="mx-auto max-w-3xl">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
          <Brain className="size-7 text-primary" />
        </div>

        <Badge
          variant="secondary"
          className="mb-4 rounded-full px-3 py-1"
        >
          Your AI second brain
        </Badge>

        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Ask anything you have ever saved
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Search across memories, receipts, documents, images and related
          knowledge using natural language.
        </p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/80 p-3 shadow-xl shadow-black/5 transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
        <Textarea
          rows={3}
          placeholder="Ask Omni anything about your memories..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !loading
            ) {
              e.preventDefault()
              handleAsk()
            }
          }}
          className="min-h-[92px] resize-none border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0"
        />

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <p className="hidden text-xs text-muted-foreground sm:block">
            Press Enter to ask · Shift + Enter for a new line
          </p>

          <Button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="ml-auto gap-2 rounded-xl px-5"
          >
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                Thinking
              </>
            ) : (
              <>
                Ask Omni
                <ArrowUpRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {!answer && !loading && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[
            "What did I buy today?",
            "Show my recent receipts",
            "What warranties do I have?",
            "Summarize my latest memories",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuestion(suggestion)}
              className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-8 rounded-2xl border border-border/60 bg-background/50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="size-4 animate-pulse text-primary" />
            </div>

            <div>
              <p className="font-medium">
                Omni is searching your memories
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Finding relevant memories, metadata and relationships...
              </p>

              <div className="mt-4 flex gap-1">
                <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="size-2 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      {answer && !loading && (
        <div className="mt-8 space-y-5">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground shadow-lg shadow-primary/10">
              {question}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <Brain className="size-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border/60 bg-background/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <p className="font-semibold">
                  Omni
                </p>

                <Badge
                  variant="secondary"
                  className="rounded-full text-[10px]"
                >
                  Based on your memories
                </Badge>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {answer}
              </p>
            </div>
          </div>

          {sources.length > 0 && (
            <div className="ml-0 sm:ml-[52px]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    Sources
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {sources.length} relevant memories found
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {sources.map((source: any, index: number) => {
                  const score = Math.max(
                    0,
                    Math.min(Number(source.score || 0) * 100, 100)
                  )

                  const relevance =
                    score >= 80
                      ? "Excellent match"
                      : score >= 60
                        ? "Strong match"
                        : score >= 40
                          ? "Relevant"
                          : "Possible match"

                  return (
                    <button
                      key={`${source.memory_id}-${source.chunk_index}-${index}`}
                      type="button"
                      onClick={() =>
                        handleView(Number(source.memory_id))
                      }
                      className="group rounded-2xl border border-border/60 bg-background/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <FileText className="size-4 text-primary" />
                          </span>

                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {source.title}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {relevance}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="secondary"
                          className="shrink-0 rounded-full"
                        >
                          {score.toFixed(0)}%
                        </Badge>
                      </div>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700"
                          style={{
                            width: `${score}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {source.summary || source.text}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Open memory
                        </span>

                        <ArrowUpRight className="size-3.5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</section>

      {/* Dashboard Overview */}

<section className="mb-6">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="text-sm font-medium text-primary">
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>

      <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Your memory space is ready
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        Capture knowledge, explore connected memories, and let Omni surface
        what matters.
      </p>
    </div>

    <Badge
      variant="secondary"
      className="w-fit gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2"
    >
      <TrendingUp className="size-4 text-primary" />
      Personal knowledge base
    </Badge>
  </div>

  <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {dashboardCards.map(({ label, value, icon: Icon }, index) => {
      const descriptions = [
        "Everything stored in Omni",
        "Processed and searchable",
        "Currently being analyzed",
      ]

      const accents = [
        "from-blue-500/15 to-cyan-500/5",
        "from-emerald-500/15 to-green-500/5",
        "from-amber-500/15 to-orange-500/5",
      ]

      return (
        <Card
          key={label}
          className="group relative overflow-hidden border-border/60 bg-card/60 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accents[index]}`}
          />

          <CardContent className="relative p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-2xl border border-white/5 bg-background/60 shadow-sm">
                <Icon className="size-5 text-primary" />
              </span>

              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-background/40 text-[10px] text-muted-foreground"
              >
                Live
              </Badge>
            </div>

            <div className="mt-8">
              <p className="text-4xl font-semibold tracking-tight">
                {value}
              </p>

              <p className="mt-2 font-medium">
                {label}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {descriptions[index]}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Synced with your memory engine
            </div>
          </CardContent>
        </Card>
      )
    })}
  </div>
</section>

      {/* Capture & Explore */}

<section className="mb-6 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
  <Card className="relative overflow-hidden border-border/60 bg-card/60 shadow-sm backdrop-blur">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/5" />

    <CardHeader className="relative">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge
            variant="secondary"
            className="mb-3 rounded-full px-3 py-1"
          >
            Capture memory
          </Badge>

          <CardTitle className="text-2xl">
            Feed Omni something new
          </CardTitle>

          <CardDescription className="mt-2 max-w-xl leading-6">
            Add a note, PDF, screenshot, receipt or image. Omni will analyze,
            organize and connect it automatically.
          </CardDescription>
        </div>

        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
          <Upload className="size-5 text-primary" />
        </span>
      </div>
    </CardHeader>

    <CardContent className="relative space-y-4">
      <input
        className="w-full rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        placeholder="Give this memory a title"
        value={memoryTitle}
        onChange={(e) => setMemoryTitle(e.target.value)}
      />

      <textarea
        className="min-h-[130px] w-full resize-none rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        placeholder="Write or paste the memory here..."
        value={memoryText}
        onChange={(e) => setMemoryText(e.target.value)}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border/70 bg-background/40 p-4 transition hover:border-primary/40 hover:bg-primary/[0.03]">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="size-4 text-primary" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-medium">
              Add PDF
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {pdfFile ? pdfFile.name : "Choose a document"}
            </p>
          </div>

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setPdfFile(file)

              if (file) {
                setImageFile(null)
              }
            }}
          />
        </label>

        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border/70 bg-background/40 p-4 transition hover:border-primary/40 hover:bg-primary/[0.03]">
          <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10">
            <ImageIcon className="size-4 text-violet-400" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-medium">
              Add image
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {imageFile ? imageFile.name : "Screenshot, receipt or photo"}
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setImageFile(file)

              if (file) {
                setPdfFile(null)
              }
            }}
          />
        </label>
      </div>

      {(pdfFile || imageFile) && (
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary">
              Selected file
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {pdfFile?.name || imageFile?.name}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setPdfFile(null)
              setImageFile(null)
            }}
          >
            Remove
          </Button>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={uploading}
        className="h-11 w-full rounded-xl"
      >
        {uploading ? (
          <>
            <span className="mr-2 size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            Processing memory...
          </>
        ) : (
          <>
            <Upload className="mr-2 size-4" />
            Save to Omni
          </>
        )}
      </Button>
    </CardContent>
  </Card>

  <div className="grid gap-4">
    <Card className="group relative overflow-hidden border-border/60 bg-card/60 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/5" />

      <CardContent className="relative flex h-full min-h-[190px] flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquareText className="size-5 text-primary" />
          </span>

          <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>

        <div className="mt-8">
          <p className="text-xl font-semibold">
            Ask your memory
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Search your full personal knowledge base using natural language.
          </p>
        </div>
      </CardContent>
    </Card>

    <Card className="relative overflow-hidden border-border/60 bg-card/60 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Knowledge health
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {stats.total_memories === 0
                ? "Getting started"
                : `${Math.round(
                    (stats.ready_memories /
                      Math.max(stats.total_memories, 1)) *
                      100
                  )}% ready`}
            </p>
          </div>

          <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Brain className="size-5 text-emerald-400" />
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
            style={{
              width: `${
                stats.total_memories === 0
                  ? 0
                  : (stats.ready_memories /
                      Math.max(stats.total_memories, 1)) *
                    100
              }%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {stats.ready_memories} searchable memories out of{" "}
          {stats.total_memories}
        </p>
      </CardContent>
    </Card>
  </div>
</section>


      {/* Memory Library */}

<section className="mb-8">
  <Card className="overflow-hidden border-border/60 bg-card/60 shadow-sm backdrop-blur">
    <CardHeader className="border-b border-border/60 pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="size-5 text-primary" />
            Memory Library
          </CardTitle>

          <CardDescription className="mt-2">
            Search, inspect and manage everything stored in Omni.
          </CardDescription>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Database className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            className="h-11 w-full rounded-xl border border-border/70 bg-background/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            placeholder="Search your memories..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-0">
      {memories.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
            <Brain className="size-6 text-primary" />
          </span>

          <p className="mt-5 font-semibold">
            No memories found
          </p>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Add your first memory above or try a different search term.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {memories.map((memory) => {
            const typeLabel =
              memory.memory_type ||
              memory.source_type ||
              "Memory"

            const sourceType = String(
              memory.source_type || ""
            ).toLowerCase()

            const MemoryIcon =
              sourceType === "image"
                ? ImageIcon
                : FileText

            return (
              <div
                key={memory.id}
                role="button"
                tabIndex={0}
                onClick={() => handleView(memory.id)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    handleView(memory.id)
                  }
                }}
                className="group flex cursor-pointer flex-col gap-4 px-5 py-5 transition hover:bg-primary/[0.025] sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10">
                    <MemoryIcon className="size-5 text-primary" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">
                        {memory.title}
                      </p>

                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px]"
                      >
                        {typeLabel}
                      </Badge>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {memory.summary ||
                        "No summary available"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(memory.topics || [])
                        .slice(0, 3)
                        .map((topic: string) => (
                          <span
                            key={topic}
                            className="rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[10px] text-muted-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      memory.status === "READY"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {memory.status}
                  </span>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-xl opacity-100 transition hover:bg-red-500/10 sm:opacity-0 sm:group-hover:opacity-100"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDelete(memory.id)
                    }}
                  >
                    <Trash2 className="size-4 text-red-400" />
                  </Button>

                  <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </CardContent>
  </Card>
</section>


      {showMemory && selectedMemory && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    onClick={() => {
    setShowMemory(false)
    setSelectedMemory(null)
    setEditMode(false)
}}
  >

    <Card
      className="w-full max-w-2xl bg-background"
      onClick={(e) => e.stopPropagation()}
    >

      <CardHeader>

        {editMode ? (

              <input
                className="w-full rounded-md border border-border bg-background p-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

            ) : (

              <CardTitle>
                {selectedMemory.title}
              </CardTitle>

            )}

        <CardDescription>
          Memory Details
        </CardDescription>

      </CardHeader>

      <CardContent className="space-y-5">

        <div>

          <h3 className="font-semibold">
            Summary
          </h3>

          <p className="text-muted-foreground mt-2">
            {selectedMemory.summary || "No summary"}

            
          </p>

          <div>

  <h3 className="font-semibold">
    Original Text
  </h3>

  {editMode ? (

    <Textarea
      className="mt-2"
      rows={8}
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
    />

  ) : (

    <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
      {selectedMemory.text}
    </p>

  )}

</div>

        </div>

        <div>

          <h3 className="font-semibold">
            Keywords
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">

            {selectedMemory.keywords?.map((k: string) => (

              <Badge key={k}>
                {k}
              </Badge>

            ))}

          </div>

        </div>

        <div>

          <h3 className="font-semibold">
            Topics
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">

            {selectedMemory.topics?.map((t: string) => (

              <Badge
                key={t}
                variant="secondary"
              >
                {t}
              </Badge>

            ))}

          </div>

        </div>

        <div className="grid grid-cols-3 gap-4">

          <div>

            <p className="text-sm text-muted-foreground">
              Language
            </p>

            <p>
              {selectedMemory.language}
            </p>

          </div>

          <div>

            <p className="text-sm text-muted-foreground">
              Sentiment
            </p>

            <p>
              {selectedMemory.sentiment}
            </p>

          </div>

          <div>

            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <Badge>
              {selectedMemory.status}
            </Badge>

          </div>

        </div>

        <div className="flex gap-3">

  {editMode ? (

    <Button
      className="flex-1"
      onClick={handleSaveEdit}
      disabled={saving}
    >
      {saving ? "Saving..." : "Save"}
    </Button>

  ) : (

    <Button
      className="flex-1"
      onClick={() => setEditMode(true)}
    >
      Edit
    </Button>

  )}

  <Button
    variant="outline"
    className="flex-1"
    onClick={() => {
      setEditMode(false)
      setShowMemory(false)
    }}
  >
    Close
  </Button>

</div>

      </CardContent>

    </Card>

  </div>

)}

    </div>
  </div>
  )
}
