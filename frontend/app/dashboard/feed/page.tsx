'use client'

import { useRef, useState } from 'react'
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Type,
  Upload,
  X,
} from 'lucide-react'

import {
  uploadImage,
  uploadMemory,
  uploadPdf,
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

type UploadMode = 'text' | 'pdf' | 'image'

export default function FeedMemoryPage() {
  const [mode, setMode] = useState<UploadMode>('text')

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  function resetForm() {
    setTitle('')
    setText('')
    setPdfFile(null)
    setImageFile(null)
    setSuccess(false)
    setError('')

    if (pdfInputRef.current) {
      pdfInputRef.current.value = ''
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  function changeMode(nextMode: UploadMode) {
    setMode(nextMode)
    setSuccess(false)
    setError('')

    if (nextMode !== 'pdf') {
      setPdfFile(null)
    }

    if (nextMode !== 'image') {
      setImageFile(null)
    }
  }

  async function handleUpload() {
    setError('')
    setSuccess(false)

    const token = localStorage.getItem('token')

    if (!token) {
      setError('Your session has expired. Please log in again.')
      return
    }

    if (mode === 'text' && (!title.trim() || !text.trim())) {
      setError('Please enter both a title and memory text.')
      return
    }

    if (mode === 'pdf' && !pdfFile) {
      setError('Please select a PDF file.')
      return
    }

    if (mode === 'image' && !imageFile) {
      setError('Please select an image.')
      return
    }

    try {
      setUploading(true)

      if (mode === 'pdf' && pdfFile) {
        await uploadPdf(pdfFile, token)
      } else if (mode === 'image' && imageFile) {
        await uploadImage(imageFile, token)
      } else {
        await uploadMemory(title, text, token)
      }

      setSuccess(true)

      setTimeout(() => {
        resetForm()
      }, 2500)
    } catch (uploadError) {
      console.error(uploadError)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const modes = [
    {
      id: 'text' as const,
      label: 'Text memory',
      description: 'Write or paste anything',
      icon: Type,
    },
    {
      id: 'pdf' as const,
      label: 'PDF document',
      description: 'Upload reports or files',
      icon: FileText,
    },
    {
      id: 'image' as const,
      label: 'Image',
      description: 'Receipts, screenshots or photos',
      icon: ImageIcon,
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="omni-float-one absolute -left-40 top-10 size-[460px] rounded-full bg-blue-500/20 blur-[130px]" />

        <div className="omni-float-two absolute right-[-160px] top-[25%] size-[420px] rounded-full bg-violet-500/20 blur-[130px]" />

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
            <Sparkles className="mr-1.5 size-3.5 text-primary" />
            Memory ingestion workspace
          </Badge>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Feed Omni something new
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Add notes, documents, receipts, screenshots or photos. Omni will
            analyze, organize and connect them automatically.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <aside className="space-y-4">
            <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">
                  Choose memory type
                </CardTitle>

                <CardDescription>
                  Select how you want to add information.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {modes.map(({ id, label, description, icon: Icon }) => {
                  const active = mode === id

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => changeMode(id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        active
                          ? 'border-primary/40 bg-primary/10 shadow-sm'
                          : 'border-border/60 bg-background/40 hover:border-primary/25 hover:bg-primary/[0.03]'
                      }`}
                    >
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? 'bg-primary/15 text-primary'
                            : 'bg-background/60 text-muted-foreground'
                        }`}
                      >
                        <Icon className="size-5" />
                      </span>

                      <div>
                        <p className="font-medium">
                          {label}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Sparkles className="size-4 text-emerald-400" />
                  </span>

                  <div>
                    <p className="font-medium">
                      What happens next?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Omni extracts summaries, entities, dates, products,
                      topics and relationships before making the memory
                      searchable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <Card className="relative overflow-hidden border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10" />

            <CardHeader className="relative border-b border-border/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">
                    {mode === 'text'
                      ? 'Create a text memory'
                      : mode === 'pdf'
                        ? 'Upload a PDF'
                        : 'Upload an image'}
                  </CardTitle>

                  <CardDescription className="mt-2">
                    {mode === 'text'
                      ? 'Write a note, paste content, or save something important.'
                      : mode === 'pdf'
                        ? 'Upload a PDF document for extraction and analysis.'
                        : 'Upload a receipt, screenshot, document photo, or image.'}
                  </CardDescription>
                </div>

                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
                  <Upload className="size-5 text-primary" />
                </span>
              </div>
            </CardHeader>

            <CardContent className="relative p-6">
              {mode === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Memory title
                    </label>

                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Example: Meeting with product team"
                      className="mt-2 h-12 w-full rounded-xl border border-border/70 bg-background/70 px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Memory content
                    </label>

                    <Textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      placeholder="Write or paste your memory here..."
                      className="mt-2 min-h-[320px] resize-y rounded-xl border-border/70 bg-background/70 p-4 leading-7 focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Omni will automatically generate metadata.
                    </span>

                    <span>
                      {text.length} characters
                    </span>
                  </div>
                </div>
              )}

              {mode === 'pdf' && (
                <div>
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(event) => {
                      setPdfFile(event.target.files?.[0] || null)
                      setError('')
                      setSuccess(false)
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="flex min-h-[390px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/40 p-8 text-center transition hover:border-primary/40 hover:bg-primary/[0.03]"
                  >
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                      <FileText className="size-7 text-primary" />
                    </span>

                    <p className="mt-5 text-lg font-semibold">
                      {pdfFile ? pdfFile.name : 'Choose a PDF document'}
                    </p>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                      Click to browse. Omni will extract text, summarize the
                      document and make it searchable.
                    </p>

                    {pdfFile && (
                      <Badge
                        variant="secondary"
                        className="mt-4 rounded-full"
                      >
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    )}
                  </button>
                </div>
              )}

              {mode === 'image' && (
                <div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      setImageFile(event.target.files?.[0] || null)
                      setError('')
                      setSuccess(false)
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex min-h-[390px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/40 p-8 text-center transition hover:border-primary/40 hover:bg-primary/[0.03]"
                  >
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-violet-500/10">
                      <ImageIcon className="size-7 text-violet-400" />
                    </span>

                    <p className="mt-5 text-lg font-semibold">
                      {imageFile ? imageFile.name : 'Choose an image'}
                    </p>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                      Upload a receipt, screenshot, handwritten note, document
                      photo or any useful image.
                    </p>

                    {imageFile && (
                      <Badge
                        variant="secondary"
                        className="mt-4 rounded-full"
                      >
                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <span>{error}</span>

                  <button
                    type="button"
                    onClick={() => setError('')}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {success && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle2 className="size-5" />
                  Memory saved successfully.
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={resetForm}
                  disabled={uploading}
                >
                  Clear
                </Button>

                <Button
                  type="button"
                  className="min-w-40 rounded-xl"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 size-4" />
                      Save memory
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}