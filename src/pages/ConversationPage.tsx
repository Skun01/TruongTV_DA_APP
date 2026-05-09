import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { CONVERSATION_COPY } from '@/constants/conversation'
import { ConversationChat } from '@/components/conversation'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { useConversationDetail } from '@/hooks/useConversation'
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
          isEnding={false}
        />
      </div>
    </>
  )
}
