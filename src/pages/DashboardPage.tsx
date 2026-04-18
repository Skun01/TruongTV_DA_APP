import { useEffect } from 'react'
import NProgress from 'nprogress'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { DueCardsSummary } from '@/components/dashboard/DueCardsSummary'
import { RecentSessionsList } from '@/components/dashboard/RecentSessionsList'
import { LearningSettingsCard } from '@/components/dashboard/LearningSettingsCard'
import { LEARNING_COPY } from '@/constants/learning'
import { useAuthStore } from '@/stores/authStore'
import {
  useReviewToday,
  useDueCards,
  useStudyHistory,
  useLearningSettings,
  useUpdateLearningSettings,
  useCreateSession,
  useDeleteSession,
} from '@/hooks/useLearning'
import type { StudyMode } from '@/types/learning'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const reviewTodayQuery = useReviewToday()
  const dueCardsQuery = useDueCards(false)
  const historyQuery = useStudyHistory(10)
  const settingsQuery = useLearningSettings()
  const updateSettingsMutation = useUpdateLearningSettings()
  const createSessionMutation = useCreateSession()
  const deleteSessionMutation = useDeleteSession()

  const isPageLoading =
    reviewTodayQuery.isLoading || historyQuery.isLoading

  useEffect(() => {
    if (isPageLoading) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [isPageLoading])

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
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 lg:px-8">
          {/* Greeting */}
          <div className="space-y-1">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {LEARNING_COPY.greeting}
            </p>
            <h1
              className="font-heading-vn text-2xl"
              style={{ color: 'var(--on-surface)' }}
            >
              {user?.displayName ?? '...'}
            </h1>
          </div>

          {/* Due cards summary */}
          <DueCardsSummary
            review={reviewTodayQuery.data}
            isLoading={reviewTodayQuery.isLoading}
            onStartReview={handleStartReview}
            isPending={createSessionMutation.isPending || dueCardsQuery.isFetching}
          />

          {/* Recent sessions */}
          <RecentSessionsList
            sessions={historyQuery.data ?? []}
            isLoading={historyQuery.isLoading}
            onDelete={(sessionId) => deleteSessionMutation.mutate(sessionId)}
            isDeleting={deleteSessionMutation.isPending}
          />

          {/* Learning settings */}
          <LearningSettingsCard
            settings={settingsQuery.data}
            isLoading={settingsQuery.isLoading}
            onSave={(payload) => updateSettingsMutation.mutate(payload)}
            isPending={updateSettingsMutation.isPending}
          />
        </div>
      </AppLayout>
    </>
  )
}
