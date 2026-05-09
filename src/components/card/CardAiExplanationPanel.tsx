import { useState } from 'react'
import { Link } from 'react-router'
import {
  ChatCircleTextIcon,
  MagicWandIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { CARD_ERROR_MESSAGES } from '@/constants/errors'
import { getApiErrorMessage } from '@/lib/apiError'
import { useExplainCard } from '@/hooks/useCardSearch'
import { useAuthStore } from '@/stores/authStore'
import type { CardAiExplanationResponse } from '@/types/card'

const MAX_QUESTION_LENGTH = 500

const CARD_AI_COPY = {
  title: 'AI GIẢI THÍCH',
  description: 'Nhập câu hỏi riêng hoặc để trống để AI giải thích thẻ này.',
  placeholder: 'Ví dụ: Giải thích cách dùng card này trong hội thoại',
  ask: 'Hỏi AI',
  retry: 'Thử lại',
  loginTitle: 'Cần đăng nhập',
  loginDescription: 'Đăng nhập để dùng giải thích AI cho thẻ học.',
  loginAction: 'Đăng nhập',
  model: 'Model',
  emptyNote: 'Để trống câu hỏi nếu bạn muốn AI tự giải thích toàn bộ thẻ.',
  tooLong: 'Câu hỏi tối đa 500 ký tự.',
} as const

function ExplanationResult({ explanation }: { explanation: CardAiExplanationResponse }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{explanation.cardType}</Badge>
        {explanation.level && <Badge variant="outline">{explanation.level}</Badge>}
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
        {explanation.answer}
      </p>

      {explanation.model && (
        <p className="text-xs text-muted-foreground">
          {CARD_AI_COPY.model}: {explanation.model}
        </p>
      )}
    </div>
  )
}

export function CardAiExplanationPanel({ cardId }: { cardId: string }) {
  const token = useAuthStore((state) => state.token)
  const [userQuestion, setUserQuestion] = useState('')
  const [explanation, setExplanation] = useState<CardAiExplanationResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const explainMutation = useExplainCard(cardId)

  const trimmedQuestion = userQuestion.trim()
  const isTooLong = userQuestion.length > MAX_QUESTION_LENGTH
  const canSubmit = Boolean(token) && !isTooLong && !explainMutation.isPending

  const handleExplain = () => {
    if (!canSubmit) return

    setErrorMessage(null)
    explainMutation.mutate(
      trimmedQuestion ? { userQuestion: trimmedQuestion } : {},
      {
        onSuccess: (response) => {
          setExplanation(response.data)
        },
        onError: (error) => {
          setErrorMessage(getApiErrorMessage(error, CARD_ERROR_MESSAGES.default_card))
        },
      },
    )
  }

  return (
    <Card className="py-0 feature-card">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MagicWandIcon size={18} weight="duotone" />
          </div>
          <div className="min-w-0">
            <span className="section-title-text">{CARD_AI_COPY.title}</span>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {CARD_AI_COPY.description}
            </p>
          </div>
        </div>

        {!token ? (
          <Alert>
            <WarningCircleIcon size={16} />
            <AlertTitle>{CARD_AI_COPY.loginTitle}</AlertTitle>
            <AlertDescription>
              <p>{CARD_AI_COPY.loginDescription}</p>
              <Button asChild size="sm" className="mt-2">
                <Link to="/login">{CARD_AI_COPY.loginAction}</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-2">
              <Textarea
                value={userQuestion}
                onChange={(event) => setUserQuestion(event.target.value)}
                placeholder={CARD_AI_COPY.placeholder}
                aria-invalid={isTooLong}
                className="min-h-24 resize-none text-sm"
                disabled={explainMutation.isPending}
              />
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className={isTooLong ? 'text-destructive' : 'text-muted-foreground'}>
                  {isTooLong ? CARD_AI_COPY.tooLong : CARD_AI_COPY.emptyNote}
                </span>
                <span className={isTooLong ? 'text-destructive' : 'text-muted-foreground'}>
                  {userQuestion.length}/{MAX_QUESTION_LENGTH}
                </span>
              </div>
            </div>

            <Button onClick={handleExplain} disabled={!canSubmit} className="w-full">
              {explainMutation.isPending ? (
                <SpinnerGapIcon size={16} className="animate-spin" />
              ) : (
                <ChatCircleTextIcon size={16} weight="regular" />
              )}
              {explanation ? CARD_AI_COPY.retry : CARD_AI_COPY.ask}
            </Button>

            {errorMessage && (
              <Alert variant="destructive">
                <WarningCircleIcon size={16} />
                <AlertTitle>{CARD_ERROR_MESSAGES.default_card}</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {explanation && <ExplanationResult explanation={explanation} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}
