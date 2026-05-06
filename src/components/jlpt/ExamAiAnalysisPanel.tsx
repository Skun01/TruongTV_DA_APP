import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import type {
  JlptAiAnalysisResponse,
  JlptAiNextAction,
  JlptAiRecommendationPriority,
  JlptAiRecommendation,
  JlptAiSeverity,
} from '@/types/jlptExam'

interface ExamAiAnalysisPanelProps {
  analysis?: JlptAiAnalysisResponse
  isLoading: boolean
  errorMessage?: string
  onRetry: () => void
  onOpenRecommendation: (recommendation: JlptAiRecommendation) => void
  onOpenAction: (action: JlptAiNextAction) => void
}

const priorityTone: Record<JlptAiRecommendationPriority, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-emerald-100 text-emerald-700',
}

const severityTone: Record<JlptAiSeverity, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-sky-100 text-sky-700',
}

const overallBandLabel = {
  Excellent: 'Rất tốt',
  Good: 'Ổn định',
  NeedsPractice: 'Cần luyện thêm',
  Weak: 'Còn yếu',
} as const

const readinessLabel = {
  Ready: 'Sẵn sàng',
  Borderline: 'Sát ngưỡng',
  NotReady: 'Chưa sẵn sàng',
} as const

function formatGeneratedAt(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function AnalysisSkeleton() {
  return (
    <Card className="border-border/50 bg-surface-container-low">
      <CardHeader>
        <CardTitle>{JLPT_EXAM_COPY.aiAnalysis}</CardTitle>
        <CardDescription>{JLPT_EXAM_COPY.aiAnalysisLoading}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-3 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-28 w-full" />
      </CardContent>
    </Card>
  )
}

export function ExamAiAnalysisPanel({
  analysis,
  isLoading,
  errorMessage,
  onRetry,
  onOpenRecommendation,
  onOpenAction,
}: ExamAiAnalysisPanelProps) {
  if (isLoading) {
    return <AnalysisSkeleton />
  }

  if (!analysis) {
    return (
      <Card className="border-border/50 bg-surface-container-low">
        <CardHeader>
          <CardTitle>{JLPT_EXAM_COPY.aiAnalysis}</CardTitle>
          <CardDescription>{JLPT_EXAM_COPY.aiAnalysisDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>{JLPT_EXAM_COPY.aiAnalysisUnavailable}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="outline" onClick={onRetry}>
              {JLPT_EXAM_COPY.aiRetry}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-surface-container-low">
      <CardHeader className="border-b border-border/60">
        <div>
          <CardTitle>{JLPT_EXAM_COPY.aiAnalysis}</CardTitle>
          <CardDescription>{JLPT_EXAM_COPY.aiAnalysisDescription}</CardDescription>
        </div>
        <CardAction className="flex flex-col items-end gap-2">
          <Badge variant="outline">{analysis.level}</Badge>
          <span className="text-xs text-tertiary">
            {JLPT_EXAM_COPY.aiGeneratedAt}: {formatGeneratedAt(analysis.generatedAt)}
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <section className="rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{overallBandLabel[analysis.summary.overallBand]}</Badge>
            <Badge variant={analysis.summary.passed ? 'default' : 'destructive'}>
              {analysis.summary.passed ? JLPT_EXAM_COPY.passed : JLPT_EXAM_COPY.failed}
            </Badge>
            <Badge variant="secondary">
              {readinessLabel[analysis.summary.estimatedLevelReadiness]}
            </Badge>
          </div>
          <p className="mt-3 text-base font-semibold text-primary">
            {analysis.summary.headline}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-container-low px-3 py-2">
              <p className="text-xs text-tertiary">{JLPT_EXAM_COPY.totalScore}</p>
              <p className="text-lg font-semibold text-primary">
                {analysis.summary.scorePercent.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg bg-surface-container-low px-3 py-2">
              <p className="text-xs text-tertiary">{JLPT_EXAM_COPY.aiPriority}</p>
              <p className="text-lg font-semibold text-primary">
                {analysis.recommendations[0]?.priority ?? 'Medium'}
              </p>
            </div>
            <div className="rounded-lg bg-surface-container-low px-3 py-2">
              <p className="text-xs text-tertiary">{JLPT_EXAM_COPY.aiQuestionInsights}</p>
              <p className="text-lg font-semibold text-primary">
                {analysis.questionInsights.length}
              </p>
            </div>
          </div>
        </section>

        {analysis.sectionAnalyses.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">
              {JLPT_EXAM_COPY.aiSectionFocus}
            </h2>
            <div className="grid gap-3 xl:grid-cols-2">
              {analysis.sectionAnalyses.map((section) => (
                <div
                  key={section.sectionType}
                  className="rounded-xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-primary">
                        {JLPT_EXAM_COPY.sectionTypeLabels[section.sectionType]}
                      </p>
                      <p className="text-sm text-secondary">{section.diagnosis}</p>
                    </div>
                    <Badge variant={section.isPassed ? 'secondary' : 'destructive'}>
                      {section.score}/{section.maxScore}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium text-tertiary">
                        {JLPT_EXAM_COPY.aiStrengths}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-primary">
                        {section.strengths.map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-tertiary">
                        {JLPT_EXAM_COPY.aiWeaknesses}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-primary">
                        {section.weaknesses.map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-tertiary">
                        {JLPT_EXAM_COPY.aiRecommendedFocus}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-primary">
                        {section.recommendedFocus.map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">
              {JLPT_EXAM_COPY.aiMistakePatterns}
            </h2>
            <div className="space-y-3">
              {analysis.mistakePatterns.map((pattern) => (
                <div
                  key={pattern.patternId}
                  className="rounded-xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-primary">{pattern.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityTone[pattern.severity]}`}
                    >
                      {pattern.severity}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-medium text-tertiary">
                    {JLPT_EXAM_COPY.aiEvidence}
                  </p>
                  <p className="mt-1 text-sm text-primary">{pattern.evidence}</p>
                  <p className="mt-3 text-xs font-medium text-tertiary">
                    {JLPT_EXAM_COPY.aiAdvice}
                  </p>
                  <p className="mt-1 text-sm text-primary">{pattern.advice}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">
              {JLPT_EXAM_COPY.aiRecommendations}
            </h2>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation) => (
                <div
                  key={`${recommendation.type}-${recommendation.title}`}
                  className="rounded-xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-primary">{recommendation.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityTone[recommendation.priority]}`}
                    >
                      {recommendation.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-primary">{recommendation.reason}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-secondary">
                      {JLPT_EXAM_COPY.aiEstimatedMinutes}: {recommendation.estimatedMinutes}{' '}
                      {JLPT_EXAM_COPY.minutesUnit}
                    </p>
                    {recommendation.targetRoute && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenRecommendation(recommendation)}
                      >
                        {JLPT_EXAM_COPY.aiOpenTarget}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {analysis.nextActions.length > 0 && (
          <section className="flex flex-wrap gap-2">
            {analysis.nextActions.map((action) => (
              <Button
                key={`${action.actionType}-${action.label}`}
                variant={action.actionType === 'BackToExamList' ? 'outline' : 'default'}
                onClick={() => onOpenAction(action)}
                disabled={!action.targetRoute}
              >
                {action.label}
              </Button>
            ))}
          </section>
        )}
      </CardContent>
    </Card>
  )
}
