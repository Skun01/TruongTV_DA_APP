import { useNavigate } from 'react-router'
import {
  ArrowRightIcon,
  FoldersIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import { Progress } from '@/components/ui/progress'
import type { DeckProgressItem } from '@/types/learning'

interface DeckProgressCardProps {
  decks: DeckProgressItem[] | undefined
  isLoading: boolean
}

export function DeckProgressCard({ decks, isLoading }: DeckProgressCardProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h2 className="section-title-text">{LEARNING_COPY.deckProgressTitle}</h2>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl feature-card"
            />
          ))}
        </div>
      </section>
    )
  }

  const hasDeckData = decks && decks.length > 0

  return (
    <section className="space-y-4 rounded-[1.75rem] p-5 feature-card md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title-text flex items-center gap-2">
          <FoldersIcon size={20} weight="regular" />
          {LEARNING_COPY.deckProgressTitle}
        </h2>
      </div>

      {!hasDeckData ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low px-6 py-10">
          <StackIcon size={28} className="text-muted-foreground/40" />
          <p className="text-center text-sm text-muted-foreground">
            {LEARNING_COPY.noDeckProgress}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => (
            <div
              key={deck.deckId}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/decks/${deck.deckId}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/decks/${deck.deckId}`)
              }}
              className="group cursor-pointer rounded-2xl border border-border/50 bg-surface-container-low px-4 py-4 transition-colors hover:bg-surface-container"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="truncate text-sm font-semibold text-foreground">
                  {deck.deckTitle}
                </p>
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                  {deck.completionPercent}%
                  <ArrowRightIcon size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>

              <Progress
                value={deck.completionPercent}
                className="mt-2 h-1.5"
              />

              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {deck.masteredCards}
                  </span>{' '}
                  {LEARNING_COPY.deckMasteredLabel}
                </span>
                <span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {deck.dueCards}
                  </span>{' '}
                  {LEARNING_COPY.deckDueLabel}
                </span>
                <span>
                  <span className="font-medium text-foreground">
                    {deck.learningCards}
                  </span>{' '}
                  {LEARNING_COPY.deckLearningLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
