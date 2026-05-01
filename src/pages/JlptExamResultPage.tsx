import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { OverallScoreCard, SectionScoreCard } from '@/components/jlpt/ResultScoreCard'
import { ResultQuestionReview } from '@/components/jlpt/ResultQuestionReview'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import { useExamResult } from '@/hooks/useJlptExam'
import type { SectionType } from '@/types/jlptExam'

const SECTION_FILTER_ALL = 'all'

function ResultSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="mx-auto h-48 w-full max-w-md" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}

export function JlptExamResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [sectionFilter, setSectionFilter] = useState<SectionType | typeof SECTION_FILTER_ALL>(
    SECTION_FILTER_ALL,
  )

  const resultQuery = useExamResult(sessionId ?? '')
  const result = resultQuery.data

  useEffect(() => {
    if (resultQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [resultQuery.isFetching])

  const filteredQuestions = result?.questions.filter(
    (q) => sectionFilter === SECTION_FILTER_ALL || q.sectionType === sectionFilter,
  )

  const sectionTypes = result
    ? [...new Set(result.questions.map((q) => q.sectionType))]
    : []

  return (
    <AppLayout mainClassName="min-h-screen bg-surface pb-24 pt-20 px-4 sm:px-6 lg:px-8">
      <PageHelmet
        title={result?.examTitle ?? JLPT_EXAM_COPY.resultTitle}
        description={JLPT_EXAM_COPY.resultDescription}
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

        {resultQuery.isLoading ? (
          <ResultSkeleton />
        ) : !result ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-surface-container-low py-16">
            <p className="text-secondary">{JLPT_EXAM_COPY.emptyExams}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <header className="text-center">
              <h1 className="text-2xl font-bold text-primary">{result.examTitle}</h1>
              <Badge variant="secondary" className="mt-2">
                {result.level}
              </Badge>
            </header>

            <OverallScoreCard
              totalScore={result.totalScore}
              isPassed={result.isPassed}
              correctCount={result.questions.filter((q) => q.isCorrect).length}
              wrongCount={
                result.questions.filter(
                  (q) => !q.isCorrect && q.selectedOptionId !== null,
                ).length
              }
              unansweredCount={
                result.questions.filter((q) => q.selectedOptionId === null).length
              }
            />

            <section>
              <h2 className="mb-4 text-lg font-semibold text-primary">
                {JLPT_EXAM_COPY.sectionScores}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.sectionScores.map((section) => (
                  <SectionScoreCard key={section.sectionId} section={section} />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  {JLPT_EXAM_COPY.questionReview}
                </h2>

                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant={sectionFilter === SECTION_FILTER_ALL ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSectionFilter(SECTION_FILTER_ALL)}
                  >
                    {JLPT_EXAM_COPY.allLevels}
                  </Button>
                  {sectionTypes.map((st) => (
                    <Button
                      key={st}
                      variant={sectionFilter === st ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSectionFilter(st)}
                    >
                      {JLPT_EXAM_COPY.sectionTypeLabels[st]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredQuestions?.map((question, idx) => (
                  <ResultQuestionReview
                    key={question.questionId}
                    question={question}
                    questionNumber={idx + 1}
                  />
                ))}
              </div>
            </section>

            <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
              <Button variant="outline" onClick={() => navigate('/jlpt')}>
                {JLPT_EXAM_COPY.backToExams}
              </Button>
              <Button
                onClick={() => navigate(`/jlpt/exams/${result.examId}`)}
              >
                {JLPT_EXAM_COPY.retakeExam}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
