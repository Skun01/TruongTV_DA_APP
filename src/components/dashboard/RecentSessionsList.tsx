import { useNavigate } from 'react-router'
import {
  ClockCounterClockwiseIcon,
  PlayIcon,
  TrashIcon,
  CardsThreeIcon,
  ListChecksIcon,
  PencilLineIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { StudySessionResponse, StudyMode } from '@/types/learning'

const MODE_ICONS: Record<StudyMode, typeof CardsThreeIcon> = {
  Flashcard: CardsThreeIcon,
  MultipleChoice: ListChecksIcon,
  FillInBlank: PencilLineIcon,
}

interface RecentSessionsListProps {
  sessions: StudySessionResponse[]
  isLoading: boolean
  onDelete: (sessionId: string) => void
  isDeleting: boolean
}

export function RecentSessionsList({
  sessions,
  isLoading,
  onDelete,
  isDeleting,
}: RecentSessionsListProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h2 className="section-title-text">{LEARNING_COPY.recentSessions}</h2>
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

  return (
    <section className="space-y-4 rounded-[1.75rem] p-5 feature-card md:p-6">
      <h2 className="section-title-text flex items-center gap-2">
        <ClockCounterClockwiseIcon size={20} weight="regular" />
        {LEARNING_COPY.recentSessions}
      </h2>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low px-6 py-10">
          <StackIcon size={28} className="text-muted-foreground/40" />
          <p className="text-center text-sm text-muted-foreground">
            {LEARNING_COPY.noSessions}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const ModeIcon = MODE_ICONS[session.mode]
            const isCompleted = session.completedAt !== null
            const progress =
              session.totalCards > 0
                ? Math.round(
                    (session.completedCards / session.totalCards) * 100,
                  )
                : 0
            const accuracy =
              session.completedCards > 0
                ? Math.round(
                    (session.correctCount / session.completedCards) * 100,
                  )
                : 0

            return (
              <div
                key={session.id}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface-container-low px-4 py-4"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'var(--surface-container-highest)',
                  }}
                >
                  <ModeIcon
                    size={20}
                    weight="duotone"
                    className="text-muted-foreground"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {session.deckTitle ??
                      LEARNING_COPY.sessionModeLabel[session.mode]}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {session.completedCards}/{session.totalCards}{' '}
                      {LEARNING_COPY.cardsCount}
                    </span>
                    {isCompleted && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {accuracy}%
                      </span>
                    )}
                    {!isCompleted && (
                      <span className="text-amber-600 dark:text-amber-400">
                        {progress}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => navigate(`/study/${session.id}`)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
                      aria-label={LEARNING_COPY.continueSession}
                    >
                      <PlayIcon size={16} weight="fill" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(session.id)}
                    disabled={isDeleting}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={LEARNING_COPY.deleteSession}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
