import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { CONVERSATION_COPY } from '@/constants/conversation'
import { ConversationChat } from '@/components/conversation'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { useConversationDetail } from '@/hooks/useConversation'
import { Skeleton } from '@/components/ui/skeleton'
import type { ConversationMessage } from '@/types/conversation'

export function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()

  const detailQuery = useConversationDetail(conversationId ?? '')

  useEffect(() => {
    if (!conversationId) {
      navigate('/ai-conversations')
      return
    }
  }, [conversationId, navigate])

  const handleEndConversation = () => {
    if (conversationId) {
      navigate(`/ai-conversations/${conversationId}/result`)
    }
  }

  if (!conversationId) {
    return null
  }

  if (detailQuery.isLoading) {
    return (
      <>
        <PageHelmet title={CONVERSATION_COPY.pageTitle} />
        <div className="fixed inset-0 flex flex-col bg-surface">
          <header className="flex items-center justify-between border-b border-border/50 bg-surface px-4 py-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </header>
          <div className="flex-1 overflow-auto px-4 py-6">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              <div className="flex justify-start">
                <div className="flex max-w-[80%] gap-3">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <Skeleton className="h-20 w-64 rounded-2xl" />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex max-w-[80%] gap-3">
                  <Skeleton className="h-14 w-48 rounded-2xl" />
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex max-w-[80%] gap-3">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <Skeleton className="h-24 w-72 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 bg-surface px-4 py-4">
            <div className="mx-auto max-w-2xl">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </>
    )
  }

  const initialMessages: ConversationMessage[] = detailQuery.data?.messages.map((msg) => ({
    id: msg.messageId,
    sender: msg.sender,
    text: msg.text,
    suggestions: msg.suggestions,
    newVocabulary: msg.newVocabulary,
    grammarPoints: msg.grammarPoints,
    timestamp: msg.createdAt,
  })) ?? []

  return (
    <>
      <PageHelmet title={CONVERSATION_COPY.pageTitle} />
      <div className="fixed inset-0 flex flex-col bg-surface">
        <ConversationChat
          conversationId={conversationId}
          initialMessages={initialMessages}
          onEndConversation={handleEndConversation}
          onBack={() => navigate('/ai-conversations')}
          isEnding={false}
        />
      </div>
    </>
  )
}
