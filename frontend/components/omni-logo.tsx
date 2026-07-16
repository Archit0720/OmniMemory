import { BrainCircuit } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OmniLogo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
        <BrainCircuit className="size-5" />
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Omni<span className="text-muted-foreground">Memory</span>
        </span>
      )}
    </div>
  )
}
