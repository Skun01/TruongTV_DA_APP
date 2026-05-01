import { ClockIcon, ListNumbersIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import type { JlptExamListItemResponse } from '@/types/jlptExam'

interface ExamCardProps {
  exam: JlptExamListItemResponse
}

export function ExamCard({ exam }: ExamCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 bg-surface-container-low transition-all hover:border-primary/30 hover:shadow-md"
      onClick={() => navigate(`/jlpt/exams/${exam.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-primary group-hover:text-accent">
            {exam.title}
          </h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {exam.level}
          </Badge>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-secondary">
          <span className="flex items-center gap-1">
            <ClockIcon size={14} />
            {exam.totalDurationMinutes} {JLPT_EXAM_COPY.minutesUnit}
          </span>
          <span className="flex items-center gap-1">
            <ListNumbersIcon size={14} />
            {exam.questionsCount} {JLPT_EXAM_COPY.questionsUnit}
          </span>
          <span>
            {exam.sectionsCount} {JLPT_EXAM_COPY.sectionsUnit}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
