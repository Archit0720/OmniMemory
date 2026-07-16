import {
  FileText,
  Image as ImageIcon,
  Mic,
  Sparkles,
  StickyNote,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Node = {
  id: string
  icon: typeof FileText
  label: string
  x: number
  y: number
  delay: number
}

const NODES: Node[] = [
  { id: 'doc', icon: FileText, label: 'Documents', x: 18, y: 20, delay: 0 },
  { id: 'img', icon: ImageIcon, label: 'Screenshots', x: 78, y: 16, delay: 1.2 },
  { id: 'note', icon: StickyNote, label: 'Notes', x: 12, y: 70, delay: 0.6 },
  { id: 'audio', icon: Mic, label: 'Recordings', x: 82, y: 66, delay: 1.8 },
  { id: 'video', icon: Video, label: 'Video', x: 62, y: 84, delay: 2.4 },
]

// center hub at 50/50
const LINKS = NODES.map((n) => ({ x1: n.x, y1: n.y, x2: 50, y2: 50 }))

export function AiMemoryVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-lg select-none',
        className,
      )}
      aria-hidden
    >
      {/* ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[90px]" />
      <div className="pointer-events-none absolute right-6 top-6 size-40 rounded-full bg-chart-3/15 blur-[70px]" />

      {/* connecting lines */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {LINKS.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="var(--color-primary)"
            strokeWidth="0.35"
            strokeOpacity="0.35"
            strokeDasharray="2 2"
            style={{ animation: `omni-dash ${3 + i * 0.4}s linear infinite` }}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* central AI hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-omni-pulse absolute inset-0 -m-4 rounded-full bg-primary/25 blur-xl" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 backdrop-blur-md">
          <Sparkles className="size-8 text-primary" />
        </div>
      </div>

      {/* floating nodes */}
      {NODES.map(({ id, icon: Icon, label, x, y, delay }) => (
        <div
          key={id}
          className="animate-omni-float absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animationDelay: `${delay}s`,
          }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2 shadow-xl shadow-black/30 backdrop-blur-md">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon className="size-4" />
            </span>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
