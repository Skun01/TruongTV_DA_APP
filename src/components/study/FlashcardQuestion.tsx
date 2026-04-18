import { useState } from 'react'
import { LEARNING_COPY } from '@/constants/learning'
import type { StudyQuestionResponse } from '@/types/learning'

interface FlashcardQuestionProps {
  question: StudyQuestionResponse
  onAnswer: (result: 'Known' | 'Learning') => void
  isPending: boolean
}

export function FlashcardQuestion({
  question,
  onAnswer,
  isPending,
}: FlashcardQuestionProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Prompt */}
      <p className="text-sm text-muted-foreground">{question.prompt}</p>

      {/* Card */}
      <button
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        className="group w-full max-w-lg cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : '',
          }}
        >
          {/* Front */}
          <div
            className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl p-8 section-card-surface section-card-elevation"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="font-heading-jp text-3xl font-medium text-foreground">
              {question.frontText}
            </p>
            <p className="mt-4 text-sm text-muted-foreground/60">
              Nhấn để lật thẻ
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex min-h-[240px] flex-col items-center justify-center rounded-3xl p-8 section-card-surface section-card-elevation"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-center text-xl font-semibold text-foreground">
              {question.backText}
            </p>
          </div>
        </div>
      </button>

      {/* Answer buttons — shown after flip */}
      {isFlipped && (
        <div className="flex w-full max-w-lg gap-3">
          <button
            type="button"
            onClick={() => onAnswer('Learning')}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
          >
            {LEARNING_COPY.learning}
          </button>
          <button
            type="button"
            onClick={() => onAnswer('Known')}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            {LEARNING_COPY.known}
          </button>
        </div>
      )}
    </div>
  )
}
