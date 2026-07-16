import {
  Layers,
  Lock,
  ScanText,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const features = [
  {
    icon: Layers,
    title: 'Multimodal Memory',
    description:
      'Capture documents, screenshots, images, notes, audio and video in one unified knowledge base.',
  },
  {
    icon: Search,
    title: 'AI Search',
    description:
      'Ask questions in plain language and get precise answers pulled from everything you have saved.',
  },
  {
    icon: ScanText,
    title: 'OCR & Speech Recognition',
    description:
      'Extract text from images and transcribe recordings automatically so nothing stays locked away.',
  },
  {
    icon: Sparkles,
    title: 'Semantic Retrieval',
    description:
      'Vector embeddings surface the right memory by meaning, not just matching keywords.',
  },
  {
    icon: Lock,
    title: 'Secure Local Storage',
    description:
      'Your memories are encrypted and stored privately, fully under your control at all times.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Ready',
    description:
      'SSO, audit logs, and granular access controls built for teams that scale.',
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything your memory needs
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A complete toolkit to capture, understand and retrieve knowledge
            from any source.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group border-border/60 bg-card/50 backdrop-blur transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform group-hover:scale-105">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
