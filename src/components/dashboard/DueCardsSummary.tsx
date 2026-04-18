import { useState } from 'react'
import { LightningIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import { StudyModeSelector } from '@/components/learning/StudyModeSelector'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ReviewTodayResponse } from '@/types/learning'
import type { StudyMode } from '@/types/learning'

interface DueCardsSummaryProps {
  review: ReviewTodayResponse | undefined
  isLoading: boolean
  onStartReview: (mode: StudyMode) => void
  isPending: boolean
}

export function DueCardsSummary({
  review,
  isLoading,
  onStartReview,
  isPending,
}: DueCardsSummaryProps) {
  const [showModeDialog, setShowModeDialog] = useState(false)
  const [selectedMode, setSelectedMode] = useState<StudyMode>('MultipleChoice')
  const dueCount = review?.dueCount ?? 0

  if (isLoading) {
    return (
      <div className="h-32 animate-pulse rounded-3xl section-card-surface" />
    )
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl px-6 py-6 section-card-surface section-card-elevation">
        {/* Decorative background */}
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--primary)' }}
        />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {LEARNING_COPY.dueToday}
            </p>
            {dueCount > 0 ? (
              <p className="mt-1 text-3xl font-bold text-foreground">
                {dueCount}{' '}
                <span className="text-base font-normal text-muted-foreground">
                  {LEARNING_COPY.dueCardsLabel}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                {LEARNING_COPY.noDueCards}
              </p>
            )}
          </div>

          {dueCount > 0 && (
            <Button
              onClick={() => setShowModeDialog(true)}
              className="shrink-0 rounded-full"
              disabled={isPending}
            >
              {isPending ? (
                <SpinnerGapIcon size={16} className="animate-spin" />
              ) : (
                <LightningIcon size={16} weight="fill" />
              )}
              {LEARNING_COPY.reviewNow}
            </Button>
          )}
        </div>
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
