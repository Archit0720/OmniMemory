import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    quote:
      'OmniMemory replaced five different apps for me. I just dump everything in and ask for it later. It feels like magic.',
    name: 'Ava Reynolds',
    role: 'Product Designer',
    initials: 'AR',
  },
  {
    quote:
      'The semantic search is unreal. I found a screenshot from months ago by describing it in a single sentence.',
    name: 'Marcus Lee',
    role: 'Research Engineer',
    initials: 'ML',
  },
  {
    quote:
      'Our whole team runs on it now. Meeting recordings, docs, notes, all searchable in one place.',
    name: 'Sofia Novak',
    role: 'Head of Operations',
    initials: 'SN',
  },
]

export function Testimonials() {
  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Loved by people who never forget
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Join thousands building their second brain with OmniMemory.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="border-border/60 bg-card/50 backdrop-blur"
            >
              <CardContent className="flex h-full flex-col gap-6 pt-6">
                <p className="flex-1 text-pretty leading-relaxed text-foreground">
                  {`"${t.quote}"`}
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
