import { useNavigate, useParams } from 'react-router'
import {
  XIcon,
  TrophyIcon,
  HouseIcon,
  RepeatIcon,
  LightningIcon,
} from '@phosphor-icons/react'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { LEARNING_COPY } from '@/constants/learning'
import { useSessionResult, useRestartSession } from '@/hooks/useLearning'

const GRADES = [
  {
    min: 80,
    title: LEARNING_COPY.gradeExcellent,
    sub: LEARNING_COPY.gradeExcellentSub,
  },
  {
    min: 60,
    title: LEARNING_COPY.gradeGood,
    sub: LEARNING_COPY.gradeGoodSub,
  },
  {
    min: 0,
    title: LEARNING_COPY.gradeKeepGoing,
    sub: LEARNING_COPY.gradeKeepGoingSub,
  },
]

export function StudyResultPage() {
  const navigate = useNavigate()
  const { sessionId = '' } = useParams()
  const resultQuery = useSessionResult(sessionId)
  const restartMutation = useRestartSession()

  const result = resultQuery.data

  if (resultQuery.isLoading || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const accuracy = Math.round(result.accuracy)
  const grade = GRADES.find((g) => accuracy >= g.min) ?? GRADES[GRADES.length - 1]

  const accentColor =
    accuracy >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : accuracy >= 60
        ? 'text-amber-500'
        : 'text-rose-500'
  const accentBg =
    accuracy >= 80
      ? 'bg-emerald-50 dark:bg-emerald-950/30'
      : accuracy >= 60
        ? 'bg-amber-50 dark:bg-amber-950/30'
        : 'bg-rose-50 dark:bg-rose-950/30'
  const trophyHex =
    accuracy >= 80 ? '#059669' : accuracy >= 60 ? '#d97706' : '#f43f5e'

  return (
    <>
      <PageHelmet
        title={LEARNING_COPY.resultTitle}
        description={LEARNING_COPY.resultDescription}
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-12 items-center justify-between bg-background/90 px-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:text-foreground"
          >
            <XIcon size={15} />
          </button>
          <p className="text-sm font-semibold text-foreground">
            {LEARNING_COPY.resultTitle}
          </p>
          <div className="h-8 w-8" />
        </header>

        <div className="mx-auto max-w-md px-4 pb-16 pt-6">
          {/* Trophy + grade */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full ${accentBg}`}
            >
              <TrophyIcon
                size={42}
                weight="fill"
                style={{ color: trophyHex }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {grade.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{grade.sub}</p>
            </div>
          </div>

          {/* Accuracy big number */}
          <div className={`feature-card mb-4 rounded-3xl px-6 py-6 text-center ${accentBg}`}>
            <p className={`text-6xl font-bold tracking-tight ${accentColor}`}>
              {accuracy}%
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {LEARNING_COPY.accuracy}
            </p>
          </div>

          {/* Stats row */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            <StatCard label={LEARNING_COPY.totalCards} value={result.totalCards} />
            <StatCard
              label={LEARNING_COPY.correctCards}
              value={result.correctCount}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label={LEARNING_COPY.incorrectCards}
              value={result.incorrectCount}
              color="text-rose-500"
            />
          </div>

          {/* Deck info */}
          {result.deckTitle && (
            <div className="feature-card mb-6 rounded-2xl px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {LEARNING_COPY.sessionModeLabel[result.mode]}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {result.deckTitle}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => restartMutation.mutate(sessionId)}
              disabled={restartMutation.isPending}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container disabled:opacity-50"
            >
              <RepeatIcon size={15} />
              {LEARNING_COPY.restart}
            </button>
            <button
              type="button"
              onClick={() => navigate('/quick-learn')}
              className="feature-card hover:feature-card-hover flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-secondary transition-colors"
            >
              <LightningIcon size={14} weight="fill" />
              {LEARNING_COPY.backToQuickLearn}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-container"
            >
              <HouseIcon size={14} />
              {LEARNING_COPY.backToDashboard}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({
  label,
  value,
  color = 'text-foreground',
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="feature-card rounded-2xl px-2 py-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
