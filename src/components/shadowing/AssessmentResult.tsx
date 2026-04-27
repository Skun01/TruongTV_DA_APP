import { useMemo } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
    <p className="text-2xl font-bold leading-relaxed text-primary sm:text-3xl">
      {referenceSegments.map((segment) => {
        if (segment.isWhitespace) {
          return <span key={segment.key}>{segment.text}</span>
        }

        if (!segment.assessment) {
          return (
            <span
              key={segment.key}
              className="rounded-lg border border-dashed border-slate-300/80 bg-slate-100/70 px-1 py-0.5 text-slate-700"
            >
              {segment.text}
            </span>
          )
        }

        const score = segment.assessment.accuracyScore
        const recognizedDiffers =
          segment.assessment.displayWord &&
          segment.assessment.displayWord !== segment.text

        return (
          <Tooltip key={segment.key}>
            <TooltipTrigger asChild>
              <span
                className={`relative inline-block cursor-help rounded-lg border px-1 py-0.5 font-bold transition-transform hover:-translate-y-0.5 ${getScoreToneClasses(score)} ${recognizedDiffers ? 'underline decoration-dotted underline-offset-2' : ''}`}
              >
                {segment.text}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-64 space-y-1.5">
              <p className="font-semibold">{segment.text}</p>
              {recognizedDiffers && (
                <p className="text-xs text-secondary">
                  {SHADOWING_COPY.recognizedTextLabel}:{' '}
                  <span className="font-medium text-primary">{segment.assessment.displayWord}</span>
                </p>
              )}
              <p className="text-xs">
                {SHADOWING_COPY.wordAccuracyTooltip}: {score !== null ? Math.round(score) : '-'}
                {SHADOWING_COPY.scoreOutOf}
              </p>
              <p className="text-xs">
                {SHADOWING_COPY.errorTypeLabel}: {getErrorTypeLabel(segment.assessment.errorType)}
              </p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </p>
  )
}

function ScoreLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-secondary">
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-2.5 rounded border border-emerald-300/70 bg-emerald-100/80" />
        {SHADOWING_COPY.highScoreLegend}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-2.5 rounded border border-amber-300/80 bg-amber-100/85" />
        {SHADOWING_COPY.mediumScoreLegend}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-2.5 rounded border border-rose-300/80 bg-rose-100/90" />
        {SHADOWING_COPY.lowScoreLegend}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-2.5 rounded border border-dashed border-slate-300/80 bg-slate-100/70" />
        {SHADOWING_COPY.missingScoreLegend}
      </span>
    </div>
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

  const hasWordAssessments = attemptResult.wordAssessments.length > 0

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

      {hasWordAssessments ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-background/90 px-2 py-6 text-center sm:px-4">
            <WordHighlights attemptResult={attemptResult} />
          </div>
          <ScoreLegend />
        </div>
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
