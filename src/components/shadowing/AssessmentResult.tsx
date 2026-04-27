import { useMemo } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SHADOWING_COPY } from '@/constants/shadowing'
import type { ShadowingAttemptResponse, ShadowingAttemptWordAssessmentResponse } from '@/types/shadowing'

function getScoreTone(score: number | null): 'high' | 'medium' | 'low' | 'missing' {
  if (score === null) return 'missing'
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

function getScoreToneClasses(score: number | null) {
  const tone = getScoreTone(score)

  if (tone === 'high') {
    return 'border-emerald-300/70 bg-emerald-100/80 text-emerald-900'
  }

  if (tone === 'medium') {
    return 'border-amber-300/80 bg-amber-100/85 text-amber-900'
  }

  if (tone === 'low') {
    return 'border-rose-300/80 bg-rose-100/90 text-rose-900 shadow-[0_0_0_1px_rgba(244,63,94,0.12)]'
  }

  return 'border-slate-300/80 bg-slate-100/90 text-slate-700'
}

function getHeroScoreClasses(score: number | null) {
  const tone = getScoreTone(score)

  if (tone === 'high') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  if (tone === 'medium') {
    return 'border-amber-200 bg-amber-50 text-amber-700 ring-amber-100'
  }

  if (tone === 'low') {
    return 'border-rose-200 bg-rose-50 text-rose-700 ring-rose-100'
  }

  return 'border-slate-200 bg-slate-50 text-slate-600 ring-slate-100'
}

function getScoreBadgeClasses(score: number | null) {
  const tone = getScoreTone(score)

  if (tone === 'high') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
  }

  if (tone === 'medium') {
    return 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
  }

  if (tone === 'low') {
    return 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100'
  }

  return 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
}

function formatScore(score: number | null) {
  return score !== null ? Math.round(score) : '-'
}

function getErrorTypeLabel(errorType: string | null) {
  if (!errorType || errorType === 'None') {
    return SHADOWING_COPY.errorTypeNone
  }

  const errorTypeLabels: Record<string, string> = {
    Insertion: SHADOWING_COPY.errorTypeInsertion,
    Omission: SHADOWING_COPY.errorTypeOmission,
    Mispronunciation: SHADOWING_COPY.errorTypeMispronunciation,
    UnexpectedBreak: SHADOWING_COPY.errorTypeUnexpectedBreak,
    Monotone: SHADOWING_COPY.errorTypeMonotone,
  }

  return errorTypeLabels[errorType] ?? errorType
}

function normalizeToken(word: string) {
  return word
    .normalize('NFKC')
    .replace(/[.,/#!$%^&*;:{}=\-_~()[\]"'""''?！？。、・]/g, '')
    .trim()
    .toLowerCase()
}

function buildReferenceSegments(
  sentenceText: string,
  wordAssessments: ShadowingAttemptWordAssessmentResponse[],
) {
  const tokens = sentenceText.match(/\S+|\s+/g) ?? []
  let assessmentIndex = 0

  return tokens.map((token, index) => {
    if (/^\s+$/.test(token)) {
      return {
        key: `space-${index}`,
        text: token,
        isWhitespace: true,
        assessment: null,
      }
    }

    const normalizedToken = normalizeToken(token)
    let matchedAssessment: ShadowingAttemptWordAssessmentResponse | null = null

    while (assessmentIndex < wordAssessments.length) {
      const currentAssessment = wordAssessments[assessmentIndex]
      assessmentIndex += 1

      if (!normalizedToken || normalizeToken(currentAssessment.word) === normalizedToken) {
        matchedAssessment = currentAssessment
        break
      }
    }

    return {
      key: `token-${index}`,
      text: token,
      isWhitespace: false,
      assessment: matchedAssessment,
    }
  })
}

function WordHighlights({ attemptResult }: { attemptResult: ShadowingAttemptResponse }) {
  const referenceSegments = useMemo(
    () => buildReferenceSegments(attemptResult.sentenceText, attemptResult.wordAssessments),
    [attemptResult.sentenceText, attemptResult.wordAssessments],
  )

  return (
    <p className="text-lg leading-9 text-primary sm:text-xl">
      {referenceSegments.map((segment) => {
        if (segment.isWhitespace) {
          return <span key={segment.key}>{segment.text}</span>
        }

        if (!segment.assessment) {
          return (
            <span
              key={segment.key}
              className="rounded-xl border border-dashed border-slate-300/80 bg-slate-100/70 px-1.5 py-1 text-slate-700"
            >
              {segment.text}
            </span>
          )
        }

        const score = segment.assessment.accuracyScore

        return (
          <Tooltip key={segment.key}>
            <TooltipTrigger asChild>
              <span
                className={`cursor-help rounded-xl border px-1.5 py-1 font-semibold transition-transform hover:-translate-y-0.5 ${getScoreToneClasses(score)}`}
              >
                {segment.assessment.displayWord ?? segment.text}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-64 space-y-1">
              <p className="font-semibold">{segment.assessment.displayWord ?? segment.text}</p>
              <p>
                {SHADOWING_COPY.wordAccuracyTooltip}: {score !== null ? Math.round(score) : '-'}
                {SHADOWING_COPY.scoreOutOf}
              </p>
              <p>
                {SHADOWING_COPY.errorTypeLabel}: {getErrorTypeLabel(segment.assessment.errorType)}
              </p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </p>
  )
}

interface AssessmentResultProps {
  attemptResult: ShadowingAttemptResponse
  hasNextSentence: boolean
  onRetry: () => void
  onNext: () => void
}

export function AssessmentResult({ attemptResult, hasNextSentence, onRetry, onNext }: AssessmentResultProps) {
  const scores = [
    { label: SHADOWING_COPY.accuracyScore, value: attemptResult.accuracyScore },
    { label: SHADOWING_COPY.fluencyScore, value: attemptResult.fluencyScore },
    ...(attemptResult.completenessScore !== null
      ? [{ label: SHADOWING_COPY.completenessScore, value: attemptResult.completenessScore }]
      : []),
    ...(attemptResult.prosodyScore !== null
      ? [{ label: SHADOWING_COPY.prosodyScore, value: attemptResult.prosodyScore }]
      : []),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div
          className={`flex size-24 items-center justify-center rounded-full border-2 ring-4 text-3xl font-bold ${getHeroScoreClasses(attemptResult.pronScore)}`}
        >
          {formatScore(attemptResult.pronScore)}
        </div>
        <p className="text-sm font-medium text-secondary">
          {SHADOWING_COPY.overallPronunciation} {SHADOWING_COPY.scoreOutOf}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {scores.map((item) => (
          <Badge
            key={item.label}
            variant="outline"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${getScoreBadgeClasses(item.value)}`}
          >
            {item.label}: {formatScore(item.value)}
          </Badge>
        ))}
      </div>

      <Separator />

      {attemptResult.wordAssessments.length > 0 ? (
        <Tabs defaultValue="reference">
          <TabsList className="w-full">
            <TabsTrigger value="reference" className="flex-1">
              {SHADOWING_COPY.referenceTextLabel}
            </TabsTrigger>
            <TabsTrigger value="recognized" className="flex-1">
              {SHADOWING_COPY.recognizedTextLabel}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reference" className="mt-4">
            <div className="rounded-2xl border border-border/60 bg-background/90 p-4 sm:p-5">
              <WordHighlights attemptResult={attemptResult} />
            </div>
          </TabsContent>
          <TabsContent value="recognized" className="mt-4">
            <div className="rounded-2xl border border-dashed border-border/70 bg-surface p-4 text-base leading-8 text-secondary sm:p-5">
              {attemptResult.recognizedText ?? SHADOWING_COPY.noWordAssessment}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <p className="text-center text-sm text-secondary">{SHADOWING_COPY.noWordAssessment}</p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onRetry}>
          {SHADOWING_COPY.retrySentence}
        </Button>
        <Button onClick={onNext}>
          {hasNextSentence ? SHADOWING_COPY.nextSentence : SHADOWING_COPY.finishPractice}
          <ArrowRightIcon size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  )
}
