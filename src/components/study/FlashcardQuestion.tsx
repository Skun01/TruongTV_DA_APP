import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LEARNING_COPY } from '@/constants/learning'
import type { FlashcardResult, StudyQuestionResponse } from '@/types/learning'

interface FlashcardQuestionProps {
  question: StudyQuestionResponse
  onAnswer: (result: FlashcardResult) => Promise<void>
  isPending: boolean
}

export function FlashcardQuestion({
  question,
  onAnswer,
  isPending,
}: FlashcardQuestionProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [swipeResult, setSwipeResult] = useState<FlashcardResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitLockRef = useRef(false)
  const canSubmit = isFlipped && !isPending && !isSubmitting && swipeResult === null

  const swipeAnimation = useMemo(() => {
    if (swipeResult === 'Learning') {
      return {
        x: -520,
        rotate: -18,
        opacity: 0,
      }
    }

    if (swipeResult === 'Known') {
      return {
        x: 520,
        rotate: 18,
        opacity: 0,
      }
    }

    return {
      x: 0,
      rotate: 0,
      opacity: 1,
    }
  }, [swipeResult])

  const triggerSwipe = useCallback(
    async (result: FlashcardResult) => {
      if (!canSubmit) return
      if (submitLockRef.current) return
      submitLockRef.current = true
      setSwipeResult(result)
      setIsSubmitting(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 220))
        await onAnswer(result)
      } catch {
        submitLockRef.current = false
        setSwipeResult(null)
        setIsSubmitting(false)
      }
    },
    [canSubmit, onAnswer],
  )

  useEffect(() => {
    function handleKeyboardShortcut(event: KeyboardEvent) {
      if (event.key === ' ' || event.code === 'Space' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        if (!isSubmitting && !isPending) {
          setIsFlipped((prev) => !prev)
        }
        return
      }

      if (!canSubmit) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        void triggerSwipe('Learning')
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        void triggerSwipe('Known')
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcut)
    return () => window.removeEventListener('keydown', handleKeyboardShortcut)
  }, [canSubmit, isPending, isSubmitting, triggerSwipe])

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Prompt */}
      <p className="text-sm text-muted-foreground">{question.prompt}</p>

      {/* Card */}
      <div className="w-full max-w-lg" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={question.cardId}
            drag={canSubmit ? 'x' : false}
            dragElastic={0.15}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x <= -100) {
                void triggerSwipe('Learning')
              }
              if (info.offset.x >= 100) {
                void triggerSwipe('Known')
              }
            }}
            animate={swipeAnimation}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative cursor-pointer"
            onClick={() => {
              if (!isFlipped && !isSubmitting) {
                setIsFlipped(true)
              }
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="relative min-h-[240px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="feature-card absolute inset-0 flex min-h-[240px] flex-col items-center justify-center rounded-3xl p-8"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="font-heading-jp text-3xl font-medium text-foreground">
                  {question.frontText}
                </p>
                <p className="mt-4 text-sm text-muted-foreground/60">
                  {LEARNING_COPY.flipCardHint}
                </p>
              </div>

              {/* Back */}
              <div
                className="feature-card absolute inset-0 flex min-h-[240px] flex-col items-center justify-center rounded-3xl p-8"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <p className="text-center text-xl font-semibold text-foreground">
                  {question.backText}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void triggerSwipe('Learning')}
          disabled={!canSubmit}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
        >
          {LEARNING_COPY.learning}
        </button>
        <button
          type="button"
          onClick={() => void triggerSwipe('Known')}
          disabled={!canSubmit}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
        >
          {LEARNING_COPY.known}
        </button>
      </div>
    </div>
  )
}
