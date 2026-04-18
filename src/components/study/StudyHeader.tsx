import { XIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { StudyMode } from '@/types/learning'

interface StudyHeaderProps {
  mode: StudyMode
  completedCards: number
  totalCards: number
  correctCount: number
  onExit: () => void
}

export function StudyHeader({
  mode,
  completedCards,
  totalCards,
  correctCount,
  onExit,
}: StudyHeaderProps) {
  const progress = totalCards > 0 ? (completedCards / totalCards) * 100 : 0

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Progress bar */}
      <div className="h-1 bg-surface-container-highest">
        <div
          className="h-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex h-12 items-center justify-between border-b border-border/70 bg-background/90 px-4 shadow-sm backdrop-blur-md">
        <button
          type="button"
          onClick={onExit}
          aria-label={LEARNING_COPY.exitStudy}
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container"
        >
          <XIcon size={18} />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-sm font-semibold text-foreground">
            {LEARNING_COPY.sessionModeLabel[mode]}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {completedCards} / {totalCards}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="text-emerald-600">✓</span>
          <span>{correctCount}</span>
        </div>
      </div>
    </header>
  )
}
