import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { ExamAiAnalysisPanel } from '@/components/jlpt/ExamAiAnalysisPanel'
import { OverallScoreCard, SectionScoreCard } from '@/components/jlpt/ResultScoreCard'
import { ResultQuestionReview } from '@/components/jlpt/ResultQuestionReview'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_ERROR_MESSAGES } from '@/constants/errors'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import { useExamAiAnalysis, useExamResult } from '@/hooks/useJlptExam'
import { getApiErrorMessage } from '@/lib/apiError'
import type {
  JlptAiNextAction,
  JlptAiRecommendation,
  SectionType,
} from '@/types/jlptExam'

const SECTION_FILTER_ALL = 'all'

function isFrontendRoute(path: string) {
  return (
    path === '/jlpt' ||
    path === '/jlpt/history' ||
    /^\/jlpt\/exams\/[^/]+$/.test(path) ||
    /^\/jlpt\/session\/[^/]+$/.test(path) ||
    /^\/jlpt\/session\/[^/]+\/result$/.test(path) ||
    /^\/study\/[^/]+$/.test(path) ||
    /^\/study\/[^/]+\/result$/.test(path) ||
    /^\/search(?:\?.*)?$/.test(path)
  )
}

function normalizeAiTargetRoute(rawRoute: string | null | undefined) {
  if (!rawRoute) {
    return null
  }

  const trimmedRoute = rawRoute.trim()
  if (!trimmedRoute || /^https?:\/\//i.test(trimmedRoute)) {
    return null
  }

  const normalizedRoute = trimmedRoute
    .replace(/^\/jlpt-exams\/history\/([^/]+)$/i, '/jlpt/session/$1/result')
    .replace(/^\/jlpt-exams\/history$/i, '/jlpt/history')
    .replace(/^\/jlpt-exams\/session\/([^/]+)\/result$/i, '/jlpt/session/$1/result')
    .replace(/^\/jlpt-exams\/session\/([^/]+)$/i, '/jlpt/session/$1')
    .replace(/^\/jlpt-exams\/([^/]+)$/i, '/jlpt/exams/$1')

  return isFrontendRoute(normalizedRoute) ? normalizedRoute : null
}

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
  const analysisQuery = useExamAiAnalysis(sessionId ?? '', Boolean(resultQuery.data))
  const result = resultQuery.data
  const analysis = analysisQuery.data

  useEffect(() => {
    if (resultQuery.isFetching || analysisQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [analysisQuery.isFetching, resultQuery.isFetching])

  const filteredQuestions = result?.questions.filter(
    (q) => sectionFilter === SECTION_FILTER_ALL || q.sectionType === sectionFilter,
  )

  const sectionTypes = result
    ? [...new Set(result.questions.map((q) => q.sectionType))]
    : []

  const aiInsightsByQuestionId = Object.fromEntries(
    (analysis?.questionInsights ?? []).map((insight) => [insight.questionId, insight]),
  )

  const aiErrorMessage = analysisQuery.isError
    ? getApiErrorMessage(
      analysisQuery.error,
      JLPT_EXAM_ERROR_MESSAGES.ExamSession_AiAnalysisUnavailable_503,
    )
    : undefined

  function navigateFromRecommendation(recommendation: JlptAiRecommendation) {
    if (!result) {
      return
    }

    const normalizedRoute = normalizeAiTargetRoute(recommendation.targetRoute)
    if (normalizedRoute) {
      navigate(normalizedRoute)
      return
    }

    switch (recommendation.type) {
      case 'RetakeExam':
        navigate(`/jlpt/exams/${result.examId}`)
        return
      case 'ReviewWrongQuestions':
      case 'ReviewSection':
      case 'PracticeReading':
      case 'PracticeListening':
        navigate(`/jlpt/session/${result.sessionId}/result`)
        return
      case 'StudyVocabulary':
      case 'StudyGrammar':
        navigate('/search')
        return
      default:
        gooeyToast.error('Gợi ý này chưa có trang đích hợp lệ trong frontend.')
    }
  }

  function navigateFromAction(action: JlptAiNextAction) {
    if (!result) {
      return
    }

    const normalizedRoute = normalizeAiTargetRoute(action.targetRoute)
    if (normalizedRoute) {
      navigate(normalizedRoute)
      return
    }

    switch (action.actionType) {
      case 'BackToExamList':
        navigate('/jlpt')
        return
      case 'RetakeExam':
        navigate(`/jlpt/exams/${result.examId}`)
        return
      case 'ReviewWrongQuestions':
        navigate(`/jlpt/session/${result.sessionId}/result`)
        return
      default:
        gooeyToast.error('Thao tác này chưa có trang đích hợp lệ trong frontend.')
    }
  }

  return (
    <AppLayout
      mainClassName="min-h-screen pt-24 pb-16"
      mainStyle={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:px-8">
        <PageHelmet
          title={result?.examTitle ?? JLPT_EXAM_COPY.resultTitle}
          description={JLPT_EXAM_COPY.resultDescription}
        />

        <Button
          variant="ghost"
          size="sm"
          className="w-fit rounded-full"
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
          <div className="space-y-6">
            <header className="text-center">
              <h1 className="text-2xl font-bold text-foreground">{result.examTitle}</h1>
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
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {JLPT_EXAM_COPY.sectionScores}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.sectionScores.map((section) => (
                  <SectionScoreCard key={section.sectionId} section={section} />
                ))}
              </div>
            </section>

            <ExamAiAnalysisPanel
              analysis={analysis}
              isLoading={analysisQuery.isLoading}
              errorMessage={aiErrorMessage}
              onRetry={() => {
                analysisQuery.refetch()
              }}
              onOpenRecommendation={navigateFromRecommendation}
              onOpenAction={navigateFromAction}
            />

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
                    aiInsight={aiInsightsByQuestionId[question.questionId]}
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
