import {
  FireIcon,
  TrophyIcon,
  CalendarBlankIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { LearnerStreakResponse } from '@/types/learning'

interface StreakCardProps {
  streak: LearnerStreakResponse | undefined
  isLoading: boolean
}

export function StreakCard({ streak, isLoading }: StreakCardProps) {
  if (isLoading) {
    return (
      <div className="h-40 animate-pulse rounded-[1.75rem] feature-card" />
    )
  }

  const hasStreak = streak && streak.currentStreak > 0

  if (!hasStreak) {
    return (
      <section className="space-y-3 rounded-[1.75rem] p-5 feature-card">
        <h2 className="section-title-text flex items-center gap-2">
          <FireIcon size={20} weight="regular" />
          {LEARNING_COPY.streakTitle}
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low px-6 py-8">
          <StackIcon size={28} className="text-muted-foreground/40" />
          <p className="text-center text-sm text-muted-foreground">
            {LEARNING_COPY.noStreakYet}
          </p>
        </div>
      </section>
    )
  }

  const formattedDate = streak.lastStudyDate
    ? new Date(streak.lastStudyDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null

  return (
    <section className="space-y-4 rounded-[1.75rem] p-5 feature-card">
      <h2 className="section-title-text flex items-center gap-2">
        <FireIcon size={20} weight="regular" />
        {LEARNING_COPY.streakTitle}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
          <span className="text-xs text-muted-foreground">
            {LEARNING_COPY.currentStreakLabel}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">
              {streak.currentStreak}
            </span>
            <span className="text-xs text-muted-foreground">
              {LEARNING_COPY.streakUnit}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrophyIcon size={12} weight="fill" className="text-amber-500" />
            {LEARNING_COPY.longestStreakLabel}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {streak.longestStreak}
            </span>
            <span className="text-xs text-muted-foreground">
              {LEARNING_COPY.streakUnit}
            </span>
          </div>
        </div>

        {formattedDate && (
          <div className="col-span-2 flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarBlankIcon size={12} />
              {LEARNING_COPY.lastStudyDateLabel}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formattedDate}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
