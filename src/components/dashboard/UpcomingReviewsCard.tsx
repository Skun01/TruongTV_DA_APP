import {
  CalendarDotsIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { UpcomingReviewsSummary } from '@/types/learning'

interface UpcomingReviewsCardProps {
  upcoming: UpcomingReviewsSummary | undefined
  isLoading: boolean
}

export function UpcomingReviewsCard({ upcoming, isLoading }: UpcomingReviewsCardProps) {
  if (isLoading) {
    return (
      <div className="h-36 animate-pulse rounded-[1.75rem] feature-card" />
    )
  }

  const hasData = upcoming && (upcoming.dueToday > 0 || upcoming.dueTomorrow > 0 || upcoming.dueThisWeek > 0)

  if (!hasData) {
    return (
      <section className="space-y-3 rounded-[1.75rem] p-5 feature-card">
        <h2 className="section-title-text flex items-center gap-2">
          <CalendarDotsIcon size={20} weight="regular" />
          {LEARNING_COPY.upcomingTitle}
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low px-6 py-8">
          <StackIcon size={28} className="text-muted-foreground/40" />
          <p className="text-center text-sm text-muted-foreground">
            {LEARNING_COPY.noUpcomingReviews}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4 rounded-[1.75rem] p-5 feature-card">
      <h2 className="section-title-text flex items-center gap-2">
        <CalendarDotsIcon size={20} weight="regular" />
        {LEARNING_COPY.upcomingTitle}
      </h2>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
          <span className="text-xs text-muted-foreground">
            {LEARNING_COPY.dueTodayLabel}
          </span>
          <span className="text-2xl font-bold text-primary">
            {upcoming.dueToday}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
          <span className="text-xs text-muted-foreground">
            {LEARNING_COPY.dueTomorrowLabel}
          </span>
          <span className="text-2xl font-bold text-foreground">
            {upcoming.dueTomorrow}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
          <span className="text-xs text-muted-foreground">
            {LEARNING_COPY.dueThisWeekLabel}
          </span>
          <span className="text-2xl font-bold text-foreground">
            {upcoming.dueThisWeek}
          </span>
        </div>
      </div>
    </section>
  )
}
