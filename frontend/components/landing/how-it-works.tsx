import { Brain, MessageCircleQuestion, Upload, Wand2 } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Drop in documents, images, notes or recordings from anywhere.',
  },
  {
    icon: Wand2,
    title: 'Understand',
    description: 'AI extracts text, transcribes audio and reads every detail.',
  },
  {
    icon: Brain,
    title: 'Remember',
    description: 'Everything is indexed into your private semantic memory.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Ask',
    description: 'Query naturally and get answers with sources instantly.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            From scattered files to instant answers in four steps.
          </p>
        </div>

        <ol className="mt-14 grid gap-4 md:grid-cols-4">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              className="relative rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-medium text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
