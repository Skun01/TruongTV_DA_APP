import {
  CalendarDotsIcon,
  ClockIcon,
  TrendUpIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'
import { useCardProgress } from '@/hooks/useLearning'

interface CardProgressProps {
  cardId: string
}

const TOTAL_SRS_LEVELS = 12

function formatDateTime(value: string | null) {
  if (!value) return VOCAB_DETAIL_COPY.progress.notReviewedYet
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function getSrsLevelNumber(level: string) {
  const parsedLevel = Number(level.replace('level_', ''))
  if (!Number.isFinite(parsedLevel)) return 1
  return Math.min(Math.max(parsedLevel, 1), TOTAL_SRS_LEVELS)
}

function getReviewStateLabel(nextReviewAt: string | null) {
  if (!nextReviewAt) return VOCAB_DETAIL_COPY.progress.notReviewedYet
  const nextReviewTimestamp = new Date(nextReviewAt).getTime()
  if (!Number.isFinite(nextReviewTimestamp)) return VOCAB_DETAIL_COPY.progress.notReviewedYet
  return nextReviewTimestamp <= Date.now()
    ? VOCAB_DETAIL_COPY.progress.reviewStateDue
    : VOCAB_DETAIL_COPY.progress.reviewStateUpcoming
}

export function CardProgress({ cardId }: CardProgressProps) {
  const progressQuery = useCardProgress(cardId, Boolean(cardId))
  const progress = progressQuery.data
  const currentLevel = progress ? getSrsLevelNumber(progress.srsLevel) : 1
  const levelPercent = progress ? (currentLevel / TOTAL_SRS_LEVELS) * 100 : 0

  return (
    <Card className="py-0 feature-card">
      <CardContent className="p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="section-title-text">
            {VOCAB_DETAIL_COPY.progress.title}
          </span>
        </div>

        {progressQuery.isLoading && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-surface-container p-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-2 w-full" />
              <Skeleton className="mt-3 h-3 w-24" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Skeleton className="h-[92px] rounded-xl" />
              <Skeleton className="h-[92px] rounded-xl" />
            </div>
          </div>
        )}

        {progressQuery.isError && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-3 text-sm text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">
            <WarningCircleIcon size={16} />
            <span>{VOCAB_DETAIL_COPY.progress.loadFailed}</span>
          </div>
        )}

        {progress && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-surface-container p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendUpIcon size={16} />
                  <span className="section-meta-text">{VOCAB_DETAIL_COPY.progress.levelProgress}</span>
                </div>
                <Badge variant="secondary" className="border-none">
                  {progress.srsLevel.replace('level_', 'L')}
                </Badge>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background/70">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${levelPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {VOCAB_DETAIL_COPY.progress.levelProgressValue(currentLevel, TOTAL_SRS_LEVELS)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-xl bg-surface-container p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDotsIcon size={18} className="shrink-0" />
                  <span className="section-meta-text whitespace-nowrap">{VOCAB_DETAIL_COPY.progress.nextReview}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground whitespace-nowrap">
                  {formatDateTime(progress.nextReviewAt)}
                </p>
                <Badge variant="secondary" className="mt-2 border-none text-[11px]">
                  {getReviewStateLabel(progress.nextReviewAt)}
                </Badge>
              </div>

              <div className="rounded-xl bg-surface-container p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ClockIcon size={18} className="shrink-0" />
                  <span className="section-meta-text whitespace-nowrap">{VOCAB_DETAIL_COPY.progress.lastReviewed}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground whitespace-nowrap">
                  {formatDateTime(progress.lastReviewedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
