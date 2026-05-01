import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import type { SectionScoreResponse } from '@/types/jlptExam'

interface OverallScoreProps {
  totalScore: number
  isPassed: boolean
  correctCount: number
  wrongCount: number
  unansweredCount: number
}

export function OverallScoreCard({
  totalScore,
  isPassed,
  correctCount,
  wrongCount,
  unansweredCount,
}: OverallScoreProps) {
  return (
    <Card className="border-border/50 bg-surface-container-low">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {isPassed ? (
            <CheckCircleIcon size={48} weight="fill" className="text-green-500" />
          ) : (
            <XCircleIcon size={48} weight="fill" className="text-destructive" />
          )}

          <div>
            <p className="text-3xl font-bold text-primary">
              {totalScore} {JLPT_EXAM_COPY.scoreLabel}
            </p>
            <Badge
              variant={isPassed ? 'default' : 'destructive'}
              className="mt-2"
            >
              {isPassed ? JLPT_EXAM_COPY.passed : JLPT_EXAM_COPY.failed}
            </Badge>
          </div>

          <p className="text-sm text-secondary">
            {isPassed ? JLPT_EXAM_COPY.passedMessage : JLPT_EXAM_COPY.failedMessage}
          </p>

          <div className="flex gap-6 text-center">
            <div>
              <p className="text-lg font-semibold text-green-600">{correctCount}</p>
              <p className="text-xs text-secondary">{JLPT_EXAM_COPY.correctCount}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-destructive">{wrongCount}</p>
              <p className="text-xs text-secondary">{JLPT_EXAM_COPY.wrongCount}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-amber-600">{unansweredCount}</p>
              <p className="text-xs text-secondary">{JLPT_EXAM_COPY.unansweredCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SectionScoreCardProps {
  section: SectionScoreResponse
}

export function SectionScoreCard({ section }: SectionScoreCardProps) {
  const percentage = section.maxScore > 0
    ? Math.round((section.score / section.maxScore) * 100)
    : 0

  return (
    <Card className="border-border/50 bg-surface-container-low">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">
              {JLPT_EXAM_COPY.sectionTypeLabels[section.sectionType]}
            </span>
            <Badge
              variant={section.isPassed ? 'default' : 'destructive'}
              className="text-xs"
            >
              {section.isPassed ? JLPT_EXAM_COPY.sectionPassed : JLPT_EXAM_COPY.sectionFailed}
            </Badge>
          </div>
          <span className="text-sm font-semibold text-primary">
            {section.score}/{section.maxScore}
          </span>
        </div>

        <Progress value={percentage} className="mt-3 h-2" />

        <p className="mt-2 text-xs text-tertiary">
          {JLPT_EXAM_COPY.passScore}: {section.passScore}
        </p>
      </CardContent>
    </Card>
  )
}
