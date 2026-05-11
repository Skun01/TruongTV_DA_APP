import { useState } from 'react'
import { ChatCircleDotsIcon } from '@phosphor-icons/react'
import { CONVERSATION_COPY } from '@/constants/conversation'
import {
  useConversationScenarios,
  useConversations,
  useStartConversation,
  useDeleteConversation,
} from '@/hooks/useConversation'
import {
  ConversationHistoryCard,
  NewConversationPanel,
} from '@/components/conversation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHelmet } from '@/components/seo/PageHelmet'

const PAGE_SIZE = 10

export function ConversationListPage() {
  const [showNewConversation, setShowNewConversation] = useState(false)

  const scenariosQuery = useConversationScenarios()
  const conversationsQuery = useConversations({ page: 1, pageSize: PAGE_SIZE })
  const startMutation = useStartConversation()
  const deleteMutation = useDeleteConversation()

  const handleStartConversation = (
    scenarioId: string,
    level: string,
    customScenario?: string,
  ) => {
    startMutation.mutate({
      scenario: scenarioId as any,
      level: level as any,
      customScenario,
    })
  }

  const handleDeleteConversation = async (conversationId: string) => {
    await deleteMutation.mutateAsync(conversationId)
  }

  return (
    <AppLayout>
      <PageHelmet
        title={CONVERSATION_COPY.pageTitle}
        description={CONVERSATION_COPY.pageDescription}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {CONVERSATION_COPY.pageTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {CONVERSATION_COPY.pageDescription}
            </p>
          </div>
          <Button onClick={() => setShowNewConversation(true)}>
            <ChatCircleDotsIcon size={18} className="mr-2" />
            {CONVERSATION_COPY.startConversation}
          </Button>
        </div>

        {/* New Conversation Modal */}
        {showNewConversation && (
          <NewConversationPanel
            scenarios={scenariosQuery.data?.scenarios ?? []}
            isLoading={scenariosQuery.isLoading}
            onStart={handleStartConversation}
            isStarting={startMutation.isPending}
            onClose={() => setShowNewConversation(false)}
          />
        )}

        {/* History Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {CONVERSATION_COPY.historyTitle}
          </h2>

          {conversationsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : conversationsQuery.data?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface-container-low py-16">
              <ChatCircleDotsIcon
                size={48}
                className="text-muted-foreground/30"
              />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {CONVERSATION_COPY.noHistory}
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {CONVERSATION_COPY.startFirst}
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => setShowNewConversation(true)}
              >
                {CONVERSATION_COPY.startConversation}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {conversationsQuery.data?.items.map((item) => (
                <ConversationHistoryCard
                  key={item.conversationId}
                  item={item}
                  onDelete={handleDeleteConversation}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  )
}
