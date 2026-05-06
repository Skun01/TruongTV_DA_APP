import { ArrowRightIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SHADOWING_COPY } from '@/constants/shadowing'
import type { ShadowingAttemptResponse } from '@/types/shadowing'

/* ─── Error type → visual style ──────────────────────────────────── */

type ErrorType = 'None' | 'Omission' | 'Mispronunciation' | 'Insertion' | 'UnexpectedBreak' | 'Monotone'

const WORD_STYLE: Record<ErrorType, string> = {
  None:             'text-primary',           // đúng: xanh đậm / mặc định
  Omission:        'text-slate-400 line-through',   // thiếu âm: xám mờ + gạch ngang
  Mispronunciation: 'text-rose-500 font-bold',       // phát âm sai: đỏ
  Insertion:        'text-rose-500 font-bold',       // thừa âm: đỏ
  UnexpectedBreak:  'text-amber-500',                 // ngắt nhịp: cam
  Monotone:         'text-amber-500',                 // đơn điệu: cam
}

function errorStyle(errorType: string | null): string {
  return WORD_STYLE[errorType as ErrorType] ?? WORD_STYLE.None
}

/* ─── Build sentence display from wordAssessments ─────────────────── */

/**
 * Builds the colored sentence by iterating wordAssessments directly.
 * Each assessment maps to one word token in display order.
 * This is the most direct mapping — no manual string splitting or fuzzy matching.
 */
function buildDisplayTokens(attemptResult: ShadowingAttemptResponse) {
  const { sentenceText, wordAssessments, recognizedText } = attemptResult

  // If no word-level assessments, fall back to plain text
  if (!wordAssessments || wordAssessments.length === 0) {
    return { tokens: [{ text: sentenceText, errorType: null }], recognizedText: null }
  }

  return {
    tokens: wordAssessments.map((a) => ({
      text: a.word,
      displayWord: a.displayWord,
      errorType: a.errorType as ErrorType,
      score: a.accuracyScore,
    })),
    recognizedText: recognizedText ?? null,
  }
}

/* ─── Score helpers ────────────────────────────────────────────────── */

function scoreColor(score: number | null) {
  if (score === null) return 'text-slate-400'
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-rose-500'
}

function scoreBarColor(score: number | null) {
  if (score === null) return 'bg-slate-200'
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-rose-500'
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function HeroScore({ score }: { score: number | null }) {
  const s = score ?? 0
  const borderCls = s >= 80 ? 'border-emerald-200 bg-emerald-50'
    : s >= 60 ? 'border-amber-200 bg-amber-50'
    : 'border-rose-200 bg-rose-50'
  const textCls = scoreColor(score)
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex size-16 items-center justify-center rounded-full border-2 text-2xl font-bold ${borderCls} ${textCls}`}>
        {score !== null ? Math.round(score) : '—'}
      </div>
      <span className="text-xs text-secondary">{SHADOWING_COPY.overallPronunciation}</span>
    </div>
  )
}

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const s = score ?? 0
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-28 rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(score)}`}
            style={{ width: `${s}%` }}
          />
        </div>
        <span className={`w-8 text-right text-xs font-semibold tabular-nums ${scoreColor(score)}`}>
          {score !== null ? Math.round(score) : '—'}
        </span>
      </div>
    </div>
  )
}

/**
 * Renders the sentence as colored word tokens.
 * Direct 1:1 mapping from wordAssessments array.
 * Correct words are normal weight + primary color.
 * Error words are styled by ErrorType (dimmed, red, amber).
 * Hover shows the ASR-recognized word if it differs.
 */
function SentenceColored({ attemptResult }: { attemptResult: ShadowingAttemptResponse }) {
  const { tokens } = buildDisplayTokens(attemptResult)

  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-center">
      {tokens.map((token, i) => {
        const cls = errorStyle(token.errorType)
        return (
          <span key={i} className={`text-2xl font-bold sm:text-3xl ${cls}`}>
            {token.text}
          </span>
        )
      })}
    </div>
  )
}

/* ─── Main ─────────────────────────────────────────────────────────── */

interface AssessmentResultProps {
  attemptResult: ShadowingAttemptResponse
  hasNextSentence: boolean
  onRetry: () => void
  onNext: () => void
}

export function AssessmentResult({ attemptResult, hasNextSentence, onRetry, onNext }: AssessmentResultProps) {
  const { pronScore, accuracyScore, fluencyScore, completenessScore, prosodyScore } = attemptResult

  return (
    <div className="space-y-5">
      {/* Hero score */}
      <HeroScore score={pronScore} />

      {/* Score breakdown */}
      <div className="space-y-2">
        <ScoreBar label={SHADOWING_COPY.accuracyScore} score={accuracyScore} />
        <ScoreBar label={SHADOWING_COPY.fluencyScore} score={fluencyScore} />
        {completenessScore !== null && <ScoreBar label={SHADOWING_COPY.completenessScore} score={completenessScore} />}
        {prosodyScore !== null && <ScoreBar label={SHADOWING_COPY.prosodyScore} score={prosodyScore} />}
      </div>

      <Separator />

      {/* Sentence with colored words */}
      <SentenceColored attemptResult={attemptResult} />

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onRetry}>
          {SHADOWING_COPY.retrySentence}
        </Button>
        <Button onClick={onNext}>
          {hasNextSentence ? SHADOWING_COPY.nextSentence : SHADOWING_COPY.finishPractice}
          <ArrowRightIcon size={16} className="ml-1.5" />
        </Button>
      </div>
    </div>
  )
}