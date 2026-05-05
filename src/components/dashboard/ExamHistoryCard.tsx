import { useNavigate } from 'react-router'
import {
  ExamIcon,
  StackIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { ExamHistoryResponse } from '@/types/learning'

interface ExamHistoryCardProps {
  examHistory: ExamHistoryResponse | undefined
  isLoading: boolean
}

export function ExamHistoryCard({ examHistory, isLoading }: ExamHistoryCardProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h2 className="section-title-text">{LEARNING_COPY.examHistoryTitle}</h2>
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl feature-card"
            />
          ))}
        </div>
      </section>
    )
  }

  const items = examHistory?.items ?? []
  const stats = examHistory?.stats

  return (
    <section className="space-y-4 rounded-[1.75rem] p-5 feature-card">
      <div className="flex items-center justify-between gap-4">
        <h2 className="section-title-text flex items-center gap-2">
          <ExamIcon size={20} weight="regular" />
          {LEARNING_COPY.examHistoryTitle}
        </h2>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => navigate('/jlpt/history')}
            className="shrink-0 text-xs font-medium text-primary hover:underline"
          >
            {LEARNING_COPY.examHistoryViewAll}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low px-6 py-10">
          <StackIcon size={28} className="text-muted-foreground/40" />
          <p className="text-center text-sm text-muted-foreground">
            {LEARNING_COPY.noExamHistory}
          </p>
        </div>
      ) : (
        <>
          {stats && stats.totalExamsTaken > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
                <span className="text-xs text-muted-foreground">
                  {LEARNING_COPY.examsTakenLabel}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {stats.totalExamsTaken}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
                <span className="text-xs text-muted-foreground">
                  {LEARNING_COPY.examPassRateLabel}
                </span>
                <span className="text-xl font-bold text-primary">
                  {stats.passRate}%
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-low px-4 py-4">
                <span className="text-xs text-muted-foreground">
                  {LEARNING_COPY.examAvgScoreLabel}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {stats.averageScore}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item) => {
              const formattedDate = item.submittedAt
                ? new Date(item.submittedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : null

              return (
                <div
                  key={item.examSessionId}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/jlpt/results/${item.examSessionId}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate(`/jlpt/results/${item.examSessionId}`)
                  }}
                  className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border/50 bg-surface-container-low px-4 py-4 transition-colors hover:bg-surface-container"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'var(--surface-container-highest)' }}
                  >
                    <span className="text-xs font-bold text-muted-foreground">
                      {item.examLevel}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.examTitle}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      {item.totalScore !== null && (
                        <span>
                          {LEARNING_COPY.examScoreLabel}: {item.totalScore}/{item.maxScore}
                        </span>
                      )}
                      <span>
                        {item.accuracy}%
                      </span>
                      {formattedDate && <span>{formattedDate}</span>}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {item.isPassed === true && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircleIcon size={14} weight="fill" />
                        {LEARNING_COPY.examPassedBadge}
                      </span>
                    )}
                    {item.isPassed === false && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400">
                        <XCircleIcon size={14} weight="fill" />
                        {LEARNING_COPY.examFailedBadge}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
