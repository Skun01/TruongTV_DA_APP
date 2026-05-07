import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import type {
  JlptAiAnalysisResponse,
  JlptAiNextAction,
  JlptAiRecommendationPriority,
  JlptAiRecommendation,
  JlptAiSeverity,
  JlptAiSectionAnalysis,
  JlptAiMistakePattern,
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

const severityLabel: Record<JlptAiSeverity, string> = {
  High: 'Cao',
  Medium: 'Trung bình',
  Low: 'Thấp',
}

const priorityLabel: Record<JlptAiRecommendationPriority, string> = {
  High: 'Cao',
  Medium: 'Trung bình',
  Low: 'Thấp',
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

function SectionAnalysisItem({ section }: { section: JlptAiSectionAnalysis }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">
            {JLPT_EXAM_COPY.sectionTypeLabels[section.sectionType]}
          </span>
          <Badge variant={section.isPassed ? 'secondary' : 'destructive'} className="text-xs">
            {section.score}/{section.maxScore}
          </Badge>
        </div>
        <span className="text-xs text-secondary">{section.diagnosis}</span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-tertiary">{JLPT_EXAM_COPY.aiStrengths}</p>
          <ul className="mt-1 space-y-0.5 text-xs text-primary">
            {section.strengths.map((item, i) => (
              <li key={i} className="list-inside list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-tertiary">{JLPT_EXAM_COPY.aiWeaknesses}</p>
          <ul className="mt-1 space-y-0.5 text-xs text-primary">
            {section.weaknesses.map((item, i) => (
              <li key={i} className="list-inside list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-tertiary">{JLPT_EXAM_COPY.aiRecommendedFocus}</p>
          <ul className="mt-1 space-y-0.5 text-xs text-primary">
            {section.recommendedFocus.map((item, i) => (
              <li key={i} className="list-inside list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function MistakePatternItem({ pattern }: { pattern: JlptAiMistakePattern }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">{pattern.title}</span>
          <Badge
            variant="outline"
            className={`text-xs ${severityTone[pattern.severity]}`}
          >
            {severityLabel[pattern.severity]}
          </Badge>
        </div>
      </div>
      <p className="mt-2 text-xs text-secondary">{pattern.evidence}</p>
      <p className="mt-1 text-xs text-tertiary">
        <span className="font-medium">{JLPT_EXAM_COPY.aiAdvice}:</span> {pattern.advice}
      </p>
    </div>
  )
}

function RecommendationItem({
  recommendation,
  onOpen,
}: {
  recommendation: JlptAiRecommendation
  onOpen: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/60 p-3">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-primary">{recommendation.title}</span>
          <Badge variant="outline" className={`text-xs ${priorityTone[recommendation.priority]}`}>
            {priorityLabel[recommendation.priority]}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-secondary">{recommendation.reason}</p>
        <p className="mt-1 text-xs text-tertiary">
          {JLPT_EXAM_COPY.aiEstimatedMinutes}: {recommendation.estimatedMinutes} {JLPT_EXAM_COPY.minutesUnit}
        </p>
      </div>
      {recommendation.targetRoute && (
        <Button variant="ghost" size="sm" onClick={onOpen} className="shrink-0">
          {JLPT_EXAM_COPY.aiOpenTarget}
        </Button>
      )}
    </div>
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

  const accordionDefaultValue = [
    'section-analyses',
    ...(analysis.mistakePatterns.length > 0 ? ['mistake-patterns'] : []),
    ...(analysis.recommendations.length > 0 ? ['recommendations'] : []),
  ]

  return (
    <Card className="border-border/50 bg-surface-container-low">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>{JLPT_EXAM_COPY.aiAnalysis}</CardTitle>
            <CardDescription>{JLPT_EXAM_COPY.aiAnalysisDescription}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{analysis.level}</Badge>
              <Badge variant={analysis.summary.passed ? 'default' : 'destructive'}>
                {analysis.summary.passed ? JLPT_EXAM_COPY.passed : JLPT_EXAM_COPY.failed}
              </Badge>
            </div>
            <span className="text-xs text-tertiary">
              {formatGeneratedAt(analysis.generatedAt)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge>{overallBandLabel[analysis.summary.overallBand]}</Badge>
          <Badge variant="secondary">{readinessLabel[analysis.summary.estimatedLevelReadiness]}</Badge>
        </div>
        <p className="mt-2 text-sm font-medium text-primary">{analysis.summary.headline}</p>

        <div className="mt-3 flex flex-wrap gap-4">
          <div>
            <span className="text-xs text-tertiary">{JLPT_EXAM_COPY.totalScore}</span>
            <span className="ml-2 font-semibold text-primary">
              {analysis.summary.scorePercent.toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-xs text-tertiary">{JLPT_EXAM_COPY.aiPriority}</span>
            <span className="ml-2 font-semibold text-primary">
              {analysis.recommendations[0]?.priority
                ? priorityLabel[analysis.recommendations[0].priority]
                : 'Trung bình'}
            </span>
          </div>
          <div>
            <span className="text-xs text-tertiary">{JLPT_EXAM_COPY.aiQuestionInsights}</span>
            <span className="ml-2 font-semibold text-primary">
              {analysis.questionInsights.length}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Accordion type="multiple" defaultValue={accordionDefaultValue} className="w-full">
          {analysis.sectionAnalyses.length > 0 && (
            <AccordionItem value="section-analyses">
              <AccordionTrigger className="py-3">
                <span className="text-sm font-medium">
                  {JLPT_EXAM_COPY.aiSectionFocus} ({analysis.sectionAnalyses.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {analysis.sectionAnalyses.map((section) => (
                    <SectionAnalysisItem key={section.sectionType} section={section} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {analysis.mistakePatterns.length > 0 && (
            <AccordionItem value="mistake-patterns">
              <AccordionTrigger className="py-3">
                <span className="text-sm font-medium">
                  {JLPT_EXAM_COPY.aiMistakePatterns} ({analysis.mistakePatterns.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {analysis.mistakePatterns.map((pattern) => (
                    <MistakePatternItem key={pattern.patternId} pattern={pattern} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {analysis.recommendations.length > 0 && (
            <AccordionItem value="recommendations">
              <AccordionTrigger className="py-3">
                <span className="text-sm font-medium">
                  {JLPT_EXAM_COPY.aiRecommendations} ({analysis.recommendations.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {analysis.recommendations.map((recommendation) => (
                    <RecommendationItem
                      key={`${recommendation.type}-${recommendation.title}`}
                      recommendation={recommendation}
                      onOpen={() => onOpenRecommendation(recommendation)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {analysis.nextActions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.nextActions.map((action) => (
              <Button
                key={`${action.actionType}-${action.label}`}
                variant={action.actionType === 'BackToExamList' ? 'outline' : 'default'}
                size="sm"
                onClick={() => onOpenAction(action)}
                disabled={!action.targetRoute}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
