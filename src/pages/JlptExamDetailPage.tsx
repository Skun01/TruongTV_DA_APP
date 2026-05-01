import { useEffect, useState } from 'react'
import { ClockIcon, ListNumbersIcon, ArrowLeftIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { StartExamDialog } from '@/components/jlpt/StartExamDialog'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import {
  useActiveExamSession,
  useJlptExamDetail,
  useStartExamSession,
} from '@/hooks/useJlptExam'

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-2/3" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}

export function JlptExamDetailPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const [showStartDialog, setShowStartDialog] = useState(false)

  const examQuery = useJlptExamDetail(examId ?? '')
  const activeSessionQuery = useActiveExamSession(examId ?? '')
  const startMutation = useStartExamSession()

  const exam = examQuery.data
  const activeSession = activeSessionQuery.data
  const hasActive = activeSession?.hasActiveSession === true

  useEffect(() => {
    if (examQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [examQuery.isFetching])

  const handleStart = () => {
    if (!examId) return

    if (hasActive && activeSession?.sessionId) {
      navigate(`/jlpt/session/${activeSession.sessionId}`)
      return
    }

    setShowStartDialog(true)
  }

  const handleConfirmStart = () => {
    if (!examId) return
    startMutation.mutate(examId)
  }

  return (
    <AppLayout mainClassName="min-h-screen bg-surface pb-24 pt-20 px-4 sm:px-6 lg:px-8">
      <PageHelmet
        title={exam?.title ?? JLPT_EXAM_COPY.detailTitle}
        description={JLPT_EXAM_COPY.detailDescription}
      />

      <div className="mx-auto max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => navigate('/jlpt')}
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          {JLPT_EXAM_COPY.backToExams}
        </Button>

        {examQuery.isLoading ? (
          <DetailSkeleton />
        ) : !exam ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-surface-container-low py-16">
            <p className="text-secondary">{JLPT_EXAM_COPY.emptyExams}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <header>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold text-primary">{exam.title}</h1>
                <Badge variant="secondary" className="shrink-0 text-sm">
                  {exam.level}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1.5">
                  <ClockIcon size={16} />
                  {exam.totalDurationMinutes} {JLPT_EXAM_COPY.minutesUnit}
                </span>
                <span className="flex items-center gap-1.5">
                  <ListNumbersIcon size={16} />
                  {exam.questionsCount} {JLPT_EXAM_COPY.questionsUnit}
                </span>
                <span>
                  {exam.sectionsCount} {JLPT_EXAM_COPY.sectionsUnit}
                </span>
              </div>
            </header>

            <section>
              <h2 className="mb-4 text-lg font-semibold text-primary">
                {JLPT_EXAM_COPY.sectionsList}
              </h2>
              <div className="space-y-3">
                {exam.sections
                  .slice()
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((section) => (
                    <Card
                      key={section.sectionId}
                      className="border-border/50 bg-surface-container-low"
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium text-primary">
                            {JLPT_EXAM_COPY.sectionTypeLabels[section.sectionType]}
                          </p>
                          <p className="mt-0.5 text-xs text-secondary">
                            {section.questionsCount} {JLPT_EXAM_COPY.questionsUnit}
                            {' · '}
                            {section.durationMinutes} {JLPT_EXAM_COPY.minutesUnit}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {section.questionGroupsCount} {JLPT_EXAM_COPY.sectionsUnit}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </section>

            <div className="flex justify-center pt-4">
              <Button size="lg" onClick={handleStart}>
                {hasActive ? JLPT_EXAM_COPY.resumeExam : JLPT_EXAM_COPY.startExam}
              </Button>
            </div>
          </div>
        )}
      </div>

      <StartExamDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        isStarting={startMutation.isPending}
        onConfirm={handleConfirmStart}
      />
    </AppLayout>
  )
}
