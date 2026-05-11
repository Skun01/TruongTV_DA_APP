import { useEffect } from 'react'
import { ArrowRightIcon, TrendUpIcon, TrendDownIcon, StarIcon, ArrowClockwiseIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { SubmitStudyAnswerResponse } from '@/types/learning'

interface AnswerFeedbackProps {
  result: SubmitStudyAnswerResponse
  onNext: () => void
}

export function AnswerFeedback({ result, onNext }: AnswerFeedbackProps) {
  const isCorrect = result.isCorrect

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext])

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-lg space-y-3">
        {/* SRS feedback */}
        <div
          className={`feature-card flex items-center justify-between rounded-2xl px-4 py-3 ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
              : 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <TrendUpIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendDownIcon size={16} className="text-rose-500 dark:text-rose-400" />
            )}
            <span
              className={`text-sm font-semibold ${
                isCorrect
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-rose-700 dark:text-rose-300'
              }`}
            >
              {isCorrect ? LEARNING_COPY.correct : LEARNING_COPY.incorrect}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{LEARNING_COPY.attemptProgress(result.attemptNo, result.maxAttempts)}</span>
            {result.willRepeat && (
              <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                <ArrowClockwiseIcon size={12} />
                {LEARNING_COPY.retryQueued}
              </span>
            )}
            {result.isMastered && (
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <StarIcon size={12} weight="fill" />
                {LEARNING_COPY.mastered}
              </span>
            )}
            <span>
              {result.completedCards} / {result.completedCards + result.remainingCards}
            </span>
          </div>
        </div>

        {!isCorrect && (
          <div className="feature-card space-y-3 rounded-2xl border-rose-200 bg-rose-50 px-4 py-4 dark:border-rose-800 dark:bg-rose-950/20">
            {result.canonicalAnswer && (
              <div>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {LEARNING_COPY.canonicalAnswer}
                </p>
                <p className="mt-1 font-heading-jp text-sm text-rose-700 dark:text-rose-300">
                  {result.canonicalAnswer}
                </p>
              </div>
            )}

            {result.completedQuestionText && (
              <div>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {LEARNING_COPY.completedQuestionText}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-rose-700 dark:text-rose-300">
                  {result.completedQuestionText}
                </p>
              </div>
            )}

            {!result.canonicalAnswer && result.acceptedAnswers.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {LEARNING_COPY.acceptedAnswers}
                </p>
                <p className="mt-1 font-heading-jp text-sm text-rose-700 dark:text-rose-300">
                  {result.acceptedAnswers.join(' / ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        <button
          type="button"
          onClick={onNext}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-colors ${
            isCorrect
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-rose-500 text-white hover:bg-rose-600'
          }`}
        >
          {LEARNING_COPY.nextCard}
          <ArrowRightIcon size={14} />
        </button>
      </div>
    </div>
  )
}
