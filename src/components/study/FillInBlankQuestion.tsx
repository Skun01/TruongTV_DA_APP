import { useState, useRef, useEffect } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { StudyQuestionResponse } from '@/types/learning'

interface FillInBlankQuestionProps {
  question: StudyQuestionResponse
  onAnswer: (answer: string) => void
  hasAnswered: boolean
  isPending: boolean
}

export function FillInBlankQuestion({
  question,
  onAnswer,
  hasAnswered,
  isPending,
}: FillInBlankQuestionProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [question.cardId, question.attemptNo, question.sentenceId, question.questionSource])

  function handleSubmit() {
    if (!inputValue.trim() || hasAnswered || isPending) return
    onAnswer(inputValue.trim())
  }

  const sourceLabel =
    question.questionSource === 'Sentence'
      ? LEARNING_COPY.fillInBlankSentenceSource
      : LEARNING_COPY.fillInBlankPromptSource

  const questionText = question.questionText ?? question.prompt

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Prompt */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-muted-foreground">{question.prompt}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-surface-container-high px-2.5 py-1">
            {sourceLabel}
          </span>
          <span className="rounded-full bg-surface-container-high px-2.5 py-1">
            {LEARNING_COPY.attemptProgress(question.attemptNo, question.maxAttempts)}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="feature-card flex min-h-[120px] w-full max-w-lg flex-col items-center justify-center rounded-3xl p-8">
        <p className="font-heading-jp text-2xl font-medium text-foreground">
          {questionText}
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

      {/* Input bar */}
      <div className="w-full max-w-lg">
        <div
          className="feature-card flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200"
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
            className="flex-1 bg-transparent font-heading-jp text-lg text-foreground outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/40"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || hasAnswered || isPending}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              inputValue.trim() && !hasAnswered
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
