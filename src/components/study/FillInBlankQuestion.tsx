import { useState, useRef, useEffect } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { StudyQuestionResponse } from '@/types/learning'

interface FillInBlankQuestionProps {
  question: StudyQuestionResponse
  onAnswer: (answer: string) => void
  isCorrect: boolean | null
  acceptedAnswers: string[]
  isPending: boolean
}

export function FillInBlankQuestion({
  question,
  onAnswer,
  isCorrect,
  acceptedAnswers,
  isPending,
}: FillInBlankQuestionProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const hasAnswered = isCorrect !== null

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [question.cardId])

  function handleSubmit() {
    if (!inputValue.trim() || hasAnswered || isPending) return
    onAnswer(inputValue.trim())
  }

  const barBorderClass = hasAnswered
    ? isCorrect
      ? 'border-emerald-300 bg-emerald-50/80 dark:border-emerald-700 dark:bg-emerald-950/30'
      : 'border-rose-300 bg-rose-50/80 dark:border-rose-700 dark:bg-rose-950/30'
    : ''

  const inputTextClass = hasAnswered
    ? isCorrect
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400'
    : 'text-foreground'

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Prompt */}
      <p className="text-sm text-muted-foreground">{question.prompt}</p>

      {/* Question */}
      <div className="feature-card flex min-h-[120px] w-full max-w-lg flex-col items-center justify-center rounded-3xl p-8">
        <p className="font-heading-jp text-2xl font-medium text-foreground">
          {question.questionText}
        </p>
        {question.secondaryText && (
          <p className="mt-2 text-sm text-muted-foreground">
            {question.secondaryText}
          </p>
        )}
        {question.hint && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            💡 {question.hint}
          </p>
        )}
      </div>

      {/* Accepted answers feedback */}
      {hasAnswered && !isCorrect && acceptedAnswers.length > 0 && (
        <div className="feature-card w-full max-w-lg rounded-2xl border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800 dark:bg-rose-950/20">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            {LEARNING_COPY.acceptedAnswers}
          </p>
          <p className="mt-1 font-heading-jp text-sm text-rose-700 dark:text-rose-300">
            {acceptedAnswers.join(' / ')}
          </p>
        </div>
      )}

      {/* Input bar */}
      <div className="w-full max-w-lg">
        <div
          className={`feature-card flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 ${barBorderClass}`}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => !hasAnswered && setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            readOnly={hasAnswered}
            placeholder={LEARNING_COPY.inputPlaceholder}
            className={`flex-1 bg-transparent font-heading-jp text-lg outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/40 ${inputTextClass}`}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!inputValue.trim() && !hasAnswered) || isPending}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              inputValue.trim() || hasAnswered
                ? 'bg-foreground/90 text-background hover:bg-foreground'
                : 'cursor-not-allowed text-muted-foreground/30'
            }`}
          >
            <ArrowRightIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
