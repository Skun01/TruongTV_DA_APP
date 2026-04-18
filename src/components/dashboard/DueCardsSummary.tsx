import { useState } from 'react'
import {
  ArrowsClockwiseIcon,
  CaretDownIcon,
  LightningIcon,
  SpinnerGapIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import { StudyModeSelector } from '@/components/learning/StudyModeSelector'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ReviewDueCardsResponse, ReviewTodayResponse, StudyMode } from '@/types/learning'

interface DueCardsSummaryProps {
  review: ReviewTodayResponse | undefined
  dueCards: ReviewDueCardsResponse | undefined
  isLoading: boolean
  isDueCardsLoading: boolean
  onStartReview: (mode: StudyMode) => void
  onFetchDueCards: () => void
  isPending: boolean
}

export function DueCardsSummary({
  review,
  dueCards,
  isLoading,
  isDueCardsLoading,
  onStartReview,
  onFetchDueCards,
  isPending,
}: DueCardsSummaryProps) {
  const [expanded, setExpanded] = useState(false)
  const [showModeDialog, setShowModeDialog] = useState(false)
  const [selectedMode, setSelectedMode] = useState<StudyMode>('MultipleChoice')

  const dueCount = review?.dueCount ?? 0
  const totalCards = review?.totalCards ?? 0
  const dueCardIds = dueCards?.cardIds ?? []

  if (isLoading) {
    return (
      <div className="h-28 animate-pulse rounded-2xl feature-card" />
    )
  }

  function handleExpand() {
    if (!expanded) {
      onFetchDueCards()
    }
    setExpanded((v) => !v)
  }

  function handleStartReviewClick(e: React.MouseEvent) {
    e.stopPropagation()
    setShowModeDialog(true)
  }

  return (
    <>
      {/* Review Card — styled like sample app */}
      <div
        onClick={dueCount > 0 ? handleStartReviewClick : undefined}
        role={dueCount > 0 ? 'button' : undefined}
        tabIndex={dueCount > 0 ? 0 : undefined}
        onKeyDown={
          dueCount > 0
            ? (e) => { if (e.key === 'Enter') setShowModeDialog(true) }
            : undefined
        }
        className={`flex flex-col rounded-2xl ${
          dueCount > 0
            ? 'cursor-pointer feature-card bg-secondary-container/45 hover:feature-card-hover dark:bg-secondary-container/35'
            : 'feature-card bg-surface-container-low dark:bg-surface-container'
        }`}
      >
        {/* Header row */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/70">
              <ArrowsClockwiseIcon size={16} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {LEARNING_COPY.dueToday}
              </p>
              <p className="text-xs text-muted-foreground">
                {LEARNING_COPY.reviewSubtitle}
              </p>
            </div>
          </div>

          {/* Due badge + expand caret */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleExpand()
            }}
            aria-label={LEARNING_COPY.expandReviewAriaLabel}
            className="flex items-center gap-1 text-sm font-semibold text-foreground"
          >
            <span>{dueCount}</span>
            <CaretDownIcon
              size={14}
              className={`text-muted-foreground transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Expanded: due cards detail */}
        {expanded ? (
          <div className="px-5 pb-4">
            {isDueCardsLoading ? (
              <div className="flex items-center justify-center py-4">
                <SpinnerGapIcon size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : dueCardIds.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <StackIcon size={24} className="text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">
                  {LEARNING_COPY.noDueCards}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Summary stats */}
                <div className="flex gap-3">
                   <div className="flex flex-1 flex-col gap-0.5 rounded-xl border border-border/60 bg-background/60 p-3 dark:bg-surface-container-highest/40">
                    <span className="text-xs text-muted-foreground">
                      {LEARNING_COPY.dueCardsLabel}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {dueCardIds.length}
                    </span>
                  </div>
                   <div className="flex flex-1 flex-col gap-0.5 rounded-xl border border-border/60 bg-background/60 p-3 dark:bg-surface-container-highest/40">
                    <span className="text-xs text-muted-foreground">
                      {LEARNING_COPY.totalCardsScope}
                    </span>
                    <span className="text-lg font-bold text-secondary">
                      {totalCards}
                    </span>
                  </div>
                </div>

                {/* Quick review CTA */}
                <button
                  onClick={handleStartReviewClick}
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/20 dark:bg-secondary/20 dark:hover:bg-secondary/30"
                >
                  <LightningIcon size={14} weight="fill" />
                  {LEARNING_COPY.reviewNow}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="px-5 pb-5 text-xs text-muted-foreground">
            {LEARNING_COPY.reviewHint}
          </p>
        )}
      </div>

      {/* Mode selection dialog */}
      <Dialog open={showModeDialog} onOpenChange={setShowModeDialog}>
        <DialogContent className="max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{LEARNING_COPY.reviewModeTitle}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {LEARNING_COPY.reviewModeDescription.replace(
                '{count}',
                String(dueCount),
              )}
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <StudyModeSelector
              value={selectedMode}
              onChange={setSelectedMode}
            />

            <Button
              onClick={() => {
                setShowModeDialog(false)
                onStartReview(selectedMode)
              }}
              disabled={isPending}
              className="w-full rounded-full"
            >
              {isPending && (
                <SpinnerGapIcon size={16} className="animate-spin" />
              )}
              {LEARNING_COPY.startReview}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
