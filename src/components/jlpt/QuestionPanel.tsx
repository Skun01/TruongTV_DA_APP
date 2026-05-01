import { cn } from '@/lib/utils'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import type {
  ExamOptionResponse,
  ExamQuestionGroupResponse,
  ExamQuestionResponse,
} from '@/types/jlptExam'

interface QuestionPanelProps {
  group: ExamQuestionGroupResponse
  question: ExamQuestionResponse
  questionNumber: number
  selectedOptionId: string | null
  onSelectOption: (questionId: string, optionId: string | null) => void
}

function OptionButton({
  option,
  isSelected,
  onClick,
}: {
  option: ExamOptionResponse
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all',
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border/60 bg-surface-container-low hover:border-primary/40 hover:bg-primary/5',
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
          isSelected
            ? 'bg-primary text-white'
            : 'bg-muted text-secondary',
        )}
      >
        {option.label}
      </span>

      <div className="flex-1 pt-0.5">
        {option.text && (
          <span className="text-sm text-primary">{option.text}</span>
        )}
        {option.imageUrl && (
          <img
            src={option.imageUrl}
            alt={option.label}
            className="mt-2 max-h-40 rounded-md object-contain"
          />
        )}
      </div>
    </button>
  )
}

export function QuestionPanel({
  group,
  question,
  questionNumber,
  selectedOptionId,
  onSelectOption,
}: QuestionPanelProps) {
  const handleSelect = (optionId: string) => {
    const nextId = optionId === selectedOptionId ? null : optionId
    onSelectOption(question.questionId, nextId)
  }

  return (
    <div className="space-y-6">
      {group.passageText && (
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <p className="mb-1 text-xs font-medium uppercase text-tertiary">
            {JLPT_EXAM_COPY.passageLabel}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">
            {group.passageText}
          </p>
        </div>
      )}

      {group.audioUrl && (
        <audio controls className="w-full" src={group.audioUrl}>
          <track kind="captions" />
        </audio>
      )}

      {group.instruction && (
        <p className="text-sm italic text-secondary">{group.instruction}</p>
      )}

      <div>
        <h3 className="text-base font-semibold text-primary">
          {JLPT_EXAM_COPY.questionLabel} {questionNumber}
        </h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-primary">
          {question.questionText}
        </p>
        {question.imageUrl && (
          <div className="mt-3">
            <img
              src={question.imageUrl}
              alt={question.imageCaption ?? ''}
              className="max-h-48 rounded-lg object-contain"
            />
            {question.imageCaption && (
              <p className="mt-1 text-xs text-tertiary">{question.imageCaption}</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {question.options.map((option) => (
          <OptionButton
            key={option.optionId}
            option={option}
            isSelected={selectedOptionId === option.optionId}
            onClick={() => handleSelect(option.optionId)}
          />
        ))}
      </div>
    </div>
  )
}
