import { useParams, useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { CONVERSATION_COPY } from '@/constants/conversation'
import { useConversationResult } from '@/hooks/useConversation'
import { ConversationResult } from '@/components/conversation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHelmet } from '@/components/seo/PageHelmet'

export function ConversationResultPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const resultQuery = useConversationResult(conversationId ?? '')

  if (resultQuery.isLoading) {
    return (
      <>
        <PageHelmet title={CONVERSATION_COPY.resultTitle} />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </>
    )
  }

  if (!resultQuery.data) {
    return (
      <>
        <PageHelmet title={CONVERSATION_COPY.resultTitle} />
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16">
          <p className="text-muted-foreground">Không thể tải kết quả cuộc hội thoại.</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate('/ai-conversations')}
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            {CONVERSATION_COPY.backToList}
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHelmet title={CONVERSATION_COPY.resultTitle} />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => navigate('/ai-conversations')}
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          {CONVERSATION_COPY.backToList}
        </Button>

        <ConversationResult result={resultQuery.data} />
      </div>
    </>
  )
}
