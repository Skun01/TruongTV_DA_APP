import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { CONVERSATION_COPY } from '@/constants/conversation'
import { ConversationChat } from '@/components/conversation'
import { PageHelmet } from '@/components/seo/PageHelmet'

export function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()

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

  return (
    <>
      <PageHelmet title={CONVERSATION_COPY.pageTitle} />
      <div className="fixed inset-0 flex flex-col bg-surface">
        <ConversationChat
          conversationId={conversationId}
          initialMessages={[]}
          onEndConversation={handleEndConversation}
          isEnding={false}
        />
      </div>
    </>
  )
}
