import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  ListIcon,
} from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { ExamSessionTimer } from '@/components/jlpt/ExamSessionTimer'
import { QuestionNavigation } from '@/components/jlpt/QuestionNavigation'
import { QuestionPanel } from '@/components/jlpt/QuestionPanel'
import {
  ExitConfirmDialog,
  SubmitConfirmDialog,
} from '@/components/jlpt/SubmitConfirmDialog'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import {
  useExamSession,
  useSaveAnswer,
  useSubmitExamSession,
} from '@/hooks/useJlptExam'
import type {
  ExamQuestionGroupResponse,
  ExamQuestionResponse,
  ExamSessionSectionResponse,
} from '@/types/jlptExam'

interface FlatQuestion {
  sectionIndex: number
  section: ExamSessionSectionResponse
  group: ExamQuestionGroupResponse
  question: ExamQuestionResponse
  globalIndex: number
}

function flattenQuestions(sections: ExamSessionSectionResponse[]): FlatQuestion[] {
  const sorted = sections.slice().sort((a, b) => a.orderIndex - b.orderIndex)
  const result: FlatQuestion[] = []
  let globalIndex = 0

  for (let si = 0; si < sorted.length; si++) {
    const section = sorted[si]
    const groups = section.questionGroups.slice().sort((a, b) => a.orderIndex - b.orderIndex)

    for (const group of groups) {
      const questions = group.questions.slice().sort((a, b) => a.orderIndex - b.orderIndex)

      for (const question of questions) {
        result.push({ sectionIndex: si, section, group, question, globalIndex })
        globalIndex++
      }
    }
  }

  return result
}

function SessionSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-20 sm:px-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-48 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}

export function JlptExamSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const sessionQuery = useExamSession(sessionId ?? '')
  const saveAnswerMutation = useSaveAnswer(sessionId ?? '')
  const submitMutation = useSubmitExamSession(sessionId ?? '')

  const session = sessionQuery.data

  const [answers, setAnswers] = useState<Record<string, string | null>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const initialized = useRef(false)

  const flatQuestions = useMemo(
    () => (session ? flattenQuestions(session.sections) : []),
    [session],
  )

  useEffect(() => {
    if (session && !initialized.current) {
      initialized.current = true
      const initialAnswers: Record<string, string | null> = {}
      for (const fq of flattenQuestions(session.sections)) {
        if (fq.question.selectedOptionId) {
          initialAnswers[fq.question.questionId] = fq.question.selectedOptionId
        }
      }
      setAnswers(initialAnswers)
    }
  }, [session])

  useEffect(() => {
    if (sessionQuery.isFetching && !session) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [sessionQuery.isFetching, session])

  const handleSelectOption = useCallback(
    (questionId: string, optionId: string | null) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
      if (sessionId) {
        saveAnswerMutation.mutate({ questionId, selectedOptionId: optionId })
      }
    },
    [sessionId, saveAnswerMutation],
  )

  const handleNavigate = useCallback(
    (questionId: string) => {
      const idx = flatQuestions.findIndex((fq) => fq.question.questionId === questionId)
      if (idx >= 0) {
        setCurrentIndex(idx)
        setShowNav(false)
      }
    },
    [flatQuestions],
  )

  const handleSubmit = () => {
    submitMutation.mutate()
  }

  const handleExpired = useCallback(() => {
    submitMutation.mutate()
  }, [submitMutation])

  if (sessionQuery.isLoading || !session) {
    return (
      <>
        <PageHelmet title={JLPT_EXAM_COPY.sessionTitle} />
        <SessionSkeleton />
      </>
    )
  }

  const currentFQ = flatQuestions[currentIndex]
  if (!currentFQ) return null

  const totalQuestions = flatQuestions.length
  const unansweredCount = flatQuestions.filter(
    (fq) => !answers[fq.question.questionId],
  ).length

  const navItems = flatQuestions.map((fq) => ({
    questionId: fq.question.questionId,
    questionNumber: fq.globalIndex + 1,
    isAnswered: Boolean(answers[fq.question.questionId]),
  }))

  const currentSectionLabel =
    JLPT_EXAM_COPY.sectionTypeLabels[currentFQ.section.sectionType]

  return (
    <>
      <PageHelmet title={`${session.examTitle} — ${JLPT_EXAM_COPY.sessionTitle}`} />

      <div className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowExitDialog(true)}
            >
              <CaretLeftIcon size={18} />
            </Button>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-primary">{session.examTitle}</p>
              <p className="text-xs text-secondary">{currentSectionLabel}</p>
            </div>
          </div>

          <ExamSessionTimer
            expiresAt={session.expiresAt}
            serverNow={session.serverNow}
            onExpired={handleExpired}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={() => setShowNav(!showNav)}
            >
              <ListIcon size={18} />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowSubmitDialog(true)}
            >
              {JLPT_EXAM_COPY.submitExam}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-24 pt-20 sm:px-6">
        <div className="flex-1">
          <QuestionPanel
            group={currentFQ.group}
            question={currentFQ.question}
            questionNumber={currentFQ.globalIndex + 1}
            selectedOptionId={answers[currentFQ.question.questionId] ?? null}
            onSelectOption={handleSelectOption}
          />

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex <= 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              <ArrowLeftIcon size={14} className="mr-1" />
              {JLPT_EXAM_COPY.paginationPrev}
            </Button>

            <span className="text-sm text-secondary">
              {currentFQ.globalIndex + 1} {JLPT_EXAM_COPY.questionOf} {totalQuestions}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex >= totalQuestions - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              {JLPT_EXAM_COPY.paginationNext}
              <ArrowRightIcon size={14} className="ml-1" />
            </Button>
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-border/50 bg-surface-container-low p-4">
            <QuestionNavigation
              questions={navItems}
              currentQuestionId={currentFQ.question.questionId}
              onNavigate={handleNavigate}
            />
          </div>
        </aside>
      </div>

      {showNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowNav(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] overflow-y-auto rounded-t-2xl bg-surface p-6">
            <QuestionNavigation
              questions={navItems}
              currentQuestionId={currentFQ.question.questionId}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      )}

      <SubmitConfirmDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        unansweredCount={unansweredCount}
        isSubmitting={submitMutation.isPending}
        onConfirm={handleSubmit}
      />

      <ExitConfirmDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={() => navigate(`/jlpt/exams/${session.examId}`)}
      />
    </>
  )
}
