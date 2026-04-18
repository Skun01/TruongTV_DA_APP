import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import type { StudyQuestionResponse } from '@/types/learning'

interface MultipleChoiceQuestionProps {
  question: StudyQuestionResponse
  onAnswer: (selectedOptionId: string) => void
  correctOptionId: string | null
  isPending: boolean
}

export function MultipleChoiceQuestion({
  question,
  onAnswer,
  correctOptionId,
  isPending,
}: MultipleChoiceQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const hasAnswered = correctOptionId !== null

  function handleSelect(optionId: string) {
    if (hasAnswered || isPending) return
    setSelectedId(optionId)
    onAnswer(optionId)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Prompt */}
      <p className="text-sm text-muted-foreground">{question.prompt}</p>

      {/* Question text */}
      <div className="feature-card flex min-h-[120px] w-full max-w-lg flex-col items-center justify-center rounded-3xl p-8">
        <p className="font-heading-jp text-2xl font-medium text-foreground">
          {question.questionText}
        </p>
        {question.secondaryText && (
          <p className="mt-2 text-sm text-muted-foreground">
            {question.secondaryText}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id
          const isCorrect = hasAnswered && option.id === correctOptionId
          const isWrong = hasAnswered && isSelected && option.id !== correctOptionId

          let optionClass = 'feature-card hover:feature-card-hover'
          if (isCorrect) {
            optionClass =
              'feature-card border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30'
          } else if (isWrong) {
            optionClass =
              'feature-card border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30'
          } else if (hasAnswered) {
            optionClass = 'feature-card opacity-50'
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={hasAnswered || isPending}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 ${optionClass}`}
            >
              {isCorrect && (
                <CheckCircleIcon
                  size={20}
                  weight="fill"
                  className="shrink-0 text-emerald-500"
                />
              )}
              {isWrong && (
                <XCircleIcon
                  size={20}
                  weight="fill"
                  className="shrink-0 text-rose-500"
                />
              )}
              <span className="text-sm font-medium text-foreground">
                {option.text}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
