import { cn } from "@/lib/utils"

interface ProgressProps {
  value?: number
  className?: string
}

function Progress({ value = 0, className }: ProgressProps) {
  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
    >
      <div
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </div>
  )
}

export { Progress }
