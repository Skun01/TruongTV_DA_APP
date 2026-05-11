import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import NProgress from 'nprogress'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { DueCardsSummary } from '@/components/dashboard/DueCardsSummary'
import { RecentSessionsList } from '@/components/dashboard/RecentSessionsList'
import { LearningSettingsModal } from '@/components/dashboard/LearningSettingsModal'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { UpcomingReviewsCard } from '@/components/dashboard/UpcomingReviewsCard'
import { DeckProgressCard } from '@/components/dashboard/DeckProgressCard'
import { ExamHistoryCard } from '@/components/dashboard/ExamHistoryCard'
import { LEARNING_COPY } from '@/constants/learning'
import { useAuthStore } from '@/stores/authStore'
import {
  useDashboardSummary,
  useExamHistory,
  useDueCards,
  useLearningSettings,
  useUpdateLearningSettings,
  useCreateSession,
  useDeleteSession,
} from '@/hooks/useLearning'
import type { StudyMode } from '@/types/learning'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [searchParams, setSearchParams] = useSearchParams()

  const dashboardQuery = useDashboardSummary()
  const examHistoryQuery = useExamHistory(5)
  const dueCardsQuery = useDueCards(false)
  const settingsQuery = useLearningSettings()
  const updateSettingsMutation = useUpdateLearningSettings()
  const createSessionMutation = useCreateSession()
  const deleteSessionMutation = useDeleteSession()
  const isSettingsModalOpen = searchParams.get('modal') === 'learning-settings'

  const isPageLoading = dashboardQuery.isLoading

  useEffect(() => {
    if (isPageLoading) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [isPageLoading])

  const summary = dashboardQuery.data

  function handleFetchDueCards() {
    dueCardsQuery.refetch()
  }

  async function handleStartReview(mode: StudyMode) {
    const result = await dueCardsQuery.refetch()
    const cardIds = result.data?.cardIds ?? []
    if (cardIds.length === 0) return

    createSessionMutation.mutate({
      deckId: null,
      cardIds,
      mode,
    })
  }

  function handleSettingsModalChange(isOpen: boolean) {
    const nextParams = new URLSearchParams(searchParams)

    if (isOpen) {
      nextParams.set('modal', 'learning-settings')
    } else {
      nextParams.delete('modal')
    }

    setSearchParams(nextParams, { replace: true })
  }

  return (
    <>
      <PageHelmet
        title={LEARNING_COPY.dashboardTitle}
        description={LEARNING_COPY.dashboardDescription}
      />
      <AppLayout
        mainClassName="min-h-screen pt-24 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <section className="grid gap-4 rounded-[2rem] border border-border/60 bg-surface-container-low px-5 py-6 md:grid-cols-[1.2fr_0.8fr] md:px-8 lg:px-10">
            <div className="flex flex-col justify-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">
                {LEARNING_COPY.greeting}
              </span>
              <h1
                className="font-heading-vn text-3xl leading-tight md:text-4xl"
                style={{ color: 'var(--on-surface)' }}
              >
                {user?.displayName ?? '...'}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                {LEARNING_COPY.dashboardDescription}
              </p>
            </div>

            <DueCardsSummary
              review={summary?.todayReview}
              dueCards={dueCardsQuery.data}
              isLoading={isPageLoading}
              isDueCardsLoading={dueCardsQuery.isFetching}
              onStartReview={handleStartReview}
              onFetchDueCards={handleFetchDueCards}
              isPending={createSessionMutation.isPending || dueCardsQuery.isFetching}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
            <div className="flex flex-col gap-6">
              <DeckProgressCard
                decks={summary?.deckProgress}
                isLoading={isPageLoading}
              />

              <RecentSessionsList
                sessions={summary?.recentSessions?.map((s) => ({
                  id: s.id,
                  deckId: null,
                  deckTitle: s.deckTitle,
                  mode: s.mode,
                  folderIds: [],
                  totalCards: s.correctCount + s.incorrectCount,
                  completedCards: s.correctCount + s.incorrectCount,
                  remainingCards: 0,
                  correctCount: s.correctCount,
                  incorrectCount: s.incorrectCount,
                  submittedAttempts: s.correctCount + s.incorrectCount,
                  retryCards: 0,
                  skippedCardIds: [],
                  createdAt: s.completedAt ?? '',
                  completedAt: s.completedAt,
                  settings: {
                    flashcardFront: 'Title',
                    flashcardBack: 'Summary',
                    multipleChoiceQuestion: 'TitleToSummary',
                    shuffleOptions: true,
                  },
                })) ?? []}
                isLoading={isPageLoading}
                onDelete={(sessionId) => deleteSessionMutation.mutate(sessionId)}
                isDeleting={deleteSessionMutation.isPending}
              />
            </div>

            <aside className="flex flex-col gap-6 lg:pt-8">
              <StreakCard
                streak={summary?.streak}
                isLoading={isPageLoading}
              />

              <UpcomingReviewsCard
                upcoming={summary?.upcomingReviews}
                isLoading={isPageLoading}
              />

              <ExamHistoryCard
                examHistory={examHistoryQuery.data}
                isLoading={examHistoryQuery.isLoading}
              />
            </aside>
          </section>
        </div>

        <LearningSettingsModal
          isOpen={isSettingsModalOpen}
          onOpenChange={handleSettingsModalChange}
          settings={settingsQuery.data}
          isLoading={settingsQuery.isLoading}
          onSave={(payload) => updateSettingsMutation.mutate(payload)}
          isPending={updateSettingsMutation.isPending}
        />
      </AppLayout>
    </>
  )
}
