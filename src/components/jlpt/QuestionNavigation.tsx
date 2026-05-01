import { cn } from '@/lib/utils'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'

interface QuestionNavItem {
  questionId: string
  questionNumber: number
  isAnswered: boolean
}

interface QuestionNavigationProps {
  questions: QuestionNavItem[]
  currentQuestionId: string
  onNavigate: (questionId: string) => void
}

export function QuestionNavigation({
  questions,
  currentQuestionId,
  onNavigate,
}: QuestionNavigationProps) {
  const answeredCount = questions.filter((q) => q.isAnswered).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-primary">
          {JLPT_EXAM_COPY.questionNav}
        </h4>
        <span className="text-xs text-secondary">
          {answeredCount}{JLPT_EXAM_COPY.questionOf}{questions.length}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
          {JLPT_EXAM_COPY.answered}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-border/60 bg-surface-container-low" />
          {JLPT_EXAM_COPY.unanswered}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {questions.map((q) => (
          <button
            key={q.questionId}
            type="button"
            className={cn(
              'flex h-8 w-full items-center justify-center rounded text-xs font-medium transition-all',
              q.questionId === currentQuestionId && 'ring-2 ring-primary ring-offset-1',
              q.isAnswered
                ? 'bg-primary text-white'
                : 'border border-border/60 bg-surface-container-low text-secondary hover:border-primary/40',
            )}
            onClick={() => onNavigate(q.questionId)}
          >
            {q.questionNumber}
          </button>
        ))}
      </div>
    </div>
  )
}
