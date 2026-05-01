import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import type { ResultQuestionResponse } from '@/types/jlptExam'

interface ResultQuestionReviewProps {
  question: ResultQuestionResponse
  questionNumber: number
}

export function ResultQuestionReview({ question, questionNumber }: ResultQuestionReviewProps) {
  return (
    <Card className="border-border/50 bg-surface-container-low">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 pt-0.5">
            {question.selectedOptionId === null ? (
              <MinusCircleIcon size={20} weight="fill" className="text-amber-500" />
            ) : question.isCorrect ? (
              <CheckCircleIcon size={20} weight="fill" className="text-green-500" />
            ) : (
              <XCircleIcon size={20} weight="fill" className="text-destructive" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-primary">
                {JLPT_EXAM_COPY.questionLabel} {questionNumber}
              </h4>
              <p className="mt-1 whitespace-pre-wrap text-sm text-primary">
                {question.questionText}
              </p>
              {question.imageUrl && (
                <img
                  src={question.imageUrl}
                  alt=""
                  className="mt-2 max-h-32 rounded-md object-contain"
                />
              )}
            </div>

            <div className="space-y-1.5">
              {question.options.map((option) => {
                const isSelected = option.optionId === question.selectedOptionId
                const isCorrect = option.optionId === question.correctOptionId

                return (
                  <div
                    key={option.optionId}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                      isCorrect && 'bg-green-50 ring-1 ring-green-300',
                      isSelected && !isCorrect && 'bg-red-50 ring-1 ring-red-300',
                      !isCorrect && !isSelected && 'bg-muted/30',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                        isCorrect && 'bg-green-500 text-white',
                        isSelected && !isCorrect && 'bg-destructive text-white',
                        !isCorrect && !isSelected && 'bg-muted text-secondary',
                      )}
                    >
                      {option.label}
                    </span>
                    <span className="text-sm text-primary">{option.text}</span>
                    {option.imageUrl && (
                      <img
                        src={option.imageUrl}
                        alt={option.label}
                        className="ml-2 max-h-16 rounded object-contain"
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {question.selectedOptionId === null && (
              <p className="text-xs italic text-amber-600">{JLPT_EXAM_COPY.noAnswer}</p>
            )}

            {question.explanation && (
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-700">
                  {JLPT_EXAM_COPY.explanation}
                </p>
                <p className="mt-1 text-xs text-blue-600">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
