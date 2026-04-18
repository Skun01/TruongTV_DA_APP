import { ArrowRightIcon, TrendUpIcon, TrendDownIcon, StarIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { SubmitStudyAnswerResponse } from '@/types/learning'

interface AnswerFeedbackProps {
  result: SubmitStudyAnswerResponse
  onNext: () => void
}

export function AnswerFeedback({ result, onNext }: AnswerFeedbackProps) {
  const isCorrect = result.isCorrect

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6">
      <div className="mx-auto max-w-lg space-y-3">
        {/* SRS feedback */}
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/30'
              : 'bg-rose-50 dark:bg-rose-950/30'
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
