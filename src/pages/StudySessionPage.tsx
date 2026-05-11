import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { WarningCircleIcon } from '@phosphor-icons/react'
import { StudyHeader } from '@/components/study/StudyHeader'
import { FlashcardQuestion } from '@/components/study/FlashcardQuestion'
import { MultipleChoiceQuestion } from '@/components/study/MultipleChoiceQuestion'
import { FillInBlankQuestion } from '@/components/study/FillInBlankQuestion'
import { AnswerFeedback } from '@/components/study/AnswerFeedback'
import { StudyKeyboardShortcuts } from '@/components/study/StudyKeyboardShortcuts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LEARNING_COPY } from '@/constants/learning'
import {
  useSessionDetail,
  useNextQuestion,
  useSubmitAnswer,
  LEARNING_QUERY_KEYS,
} from '@/hooks/useLearning'
import type { SubmitStudyAnswerResponse } from '@/types/learning'

function buildQuestionKey(sessionId: string, cardId: string, attemptNo: number, questionSource: string, sentenceId: string | null) {
  return `${sessionId}:${cardId}:${attemptNo}:${questionSource}:${sentenceId ?? 'no-sentence'}`
}

function resolveCorrectOptionId(
  response: SubmitStudyAnswerResponse,
  options: Array<{ id: string; text: string }>,
  selectedOptionId: string,
) {
  const byCanonicalAnswer = response.canonicalAnswer
    ? options.find((option) => option.text === response.canonicalAnswer)?.id ?? null
    : null

  if (byCanonicalAnswer) {
    return byCanonicalAnswer
  }

  const byAcceptedAnswer = options.find(
    (option) =>
      response.acceptedAnswers.includes(option.id) ||
      response.acceptedAnswers.includes(option.text),
  )?.id ?? null

  if (byAcceptedAnswer) {
    return byAcceptedAnswer
  }

  return response.isCorrect ? selectedOptionId : null
}

export function StudySessionPage() {
  const navigate = useNavigate()
  const { sessionId = '' } = useParams()
  const queryClient = useQueryClient()

  const sessionQuery = useSessionDetail(sessionId)
  const questionQuery = useNextQuestion(sessionId, Boolean(sessionId))
  const submitMutation = useSubmitAnswer(sessionId)

  const [answerResult, setAnswerResult] = useState<SubmitStudyAnswerResponse | null>(null)
  const [mcqCorrectId, setMcqCorrectId] = useState<string | null>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [visible, setVisible] = useState(true)

  const session = sessionQuery.data
  const question = questionQuery.data
  const questionKey = question
    ? buildQuestionKey(
        question.sessionId,
        question.cardId,
        question.attemptNo,
        question.questionSource,
        question.sentenceId,
      )
    : 'completed'

  // Navigate to result when session is completed and no more questions
  useEffect(() => {
    if (question === null && !questionQuery.isFetching) {
      navigate(`/study/${sessionId}/result`, { replace: true })
    }
  }, [question, questionQuery.isFetching, sessionId, navigate])

  // ── MCQ submit ───────────────────────────────────────────────────────────────
  const handleMcqAnswer = useCallback(
    async (selectedOptionId: string) => {
      if (!question) return

      const response = await submitMutation.mutateAsync({
        cardId: question.cardId,
        answers: [],
        selectedOptionIds: [selectedOptionId],
        flashcardResult: null,
      })
      setAnswerResult(response)
      setMcqCorrectId(resolveCorrectOptionId(response, question.options, selectedOptionId))
    },
    [question, submitMutation],
  )

  // ── FillInBlank submit ───────────────────────────────────────────────────────
  const handleFibAnswer = useCallback(
    async (answer: string) => {
      if (!question) return

      const response = await submitMutation.mutateAsync({
        cardId: question.cardId,
        answers: [answer],
        selectedOptionIds: [],
        flashcardResult: null,
      })
      setAnswerResult(response)
    },
    [question, submitMutation],
  )

  // ── Next question ────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setAnswerResult(null)
      setMcqCorrectId(null)
      void questionQuery.refetch().finally(() => {
        setVisible(true)
      })
      void queryClient.invalidateQueries({
        queryKey: LEARNING_QUERY_KEYS.session(sessionId),
      })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 150)
  }, [queryClient, questionQuery, sessionId])

  // ── Flashcard submit ─────────────────────────────────────────────────────────
  const handleFlashcardAnswer = useCallback(
    async (result: 'Known' | 'Learning') => {
      if (!question) return

      await submitMutation.mutateAsync({
        cardId: question.cardId,
        answers: [],
        selectedOptionIds: [],
        flashcardResult: result,
      })
      handleNext()
    },
    [handleNext, question, submitMutation],
  )

  // ── Exit ─────────────────────────────────────────────────────────────────────
  function handleExit() {
    setShowExitDialog(false)
    navigate(-1)
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (sessionQuery.isLoading || questionQuery.isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StudyHeader
        mode={session.mode}
        completedCards={session.completedCards}
        totalCards={session.totalCards}
        correctCount={session.correctCount}
        retryCards={session.retryCards}
        onExit={() => setShowExitDialog(true)}
      />

      {/* Question area */}
      <main
        className="flex flex-1 flex-col items-center justify-center px-6"
        style={{ paddingTop: '5rem', paddingBottom: answerResult ? '10rem' : '4rem' }}
      >
        {question ? (
          <div
            key={questionKey}
            className={`w-full max-w-2xl transition-opacity duration-150 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {question.mode === 'Flashcard' && (
              <FlashcardQuestion
                question={question}
                onAnswer={handleFlashcardAnswer}
                isPending={submitMutation.isPending}
              />
            )}

            {question.mode === 'MultipleChoice' && (
              <MultipleChoiceQuestion
                question={question}
                onAnswer={handleMcqAnswer}
                correctOptionId={mcqCorrectId}
                isPending={submitMutation.isPending}
                shuffleOptions={session.settings.shuffleOptions}
              />
            )}

            {question.mode === 'FillInBlank' && (
              <FillInBlankQuestion
                question={question}
                onAnswer={handleFibAnswer}
                hasAnswered={Boolean(answerResult)}
                isPending={submitMutation.isPending}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xl font-bold text-foreground">
              {LEARNING_COPY.sessionCompleted}
            </p>
            <Button
              onClick={() =>
                navigate(`/study/${sessionId}/result`, { replace: true })
              }
              className="rounded-full"
            >
              {LEARNING_COPY.viewResult}
            </Button>
          </div>
        )}
      </main>

      {/* Answer feedback overlay */}
      {answerResult && question && question.mode !== 'Flashcard' && (
        <AnswerFeedback result={answerResult} onNext={handleNext} />
      )}

      <StudyKeyboardShortcuts visible={session.mode === 'Flashcard'} />

      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="max-w-sm overflow-hidden p-0" showCloseButton={false}>
          <DialogHeader className="gap-3 px-6 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30">
              <WarningCircleIcon size={24} className="text-rose-500" weight="fill" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base font-bold">
                {LEARNING_COPY.exitConfirmTitle}
              </DialogTitle>
              <DialogDescription>
                {LEARNING_COPY.exitConfirmMessage}
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="gap-3 px-6 pb-6 pt-2 sm:grid sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full rounded-xl py-2.5 text-sm font-semibold"
              onClick={() => setShowExitDialog(false)}
            >
              {LEARNING_COPY.exitCancelAction}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full rounded-xl py-2.5 text-sm font-semibold"
              onClick={handleExit}
            >
              {LEARNING_COPY.exitConfirmAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
