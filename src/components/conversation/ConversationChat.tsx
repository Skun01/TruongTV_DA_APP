import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, StopCircleIcon } from '@phosphor-icons/react'
import { CONVERSATION_COPY } from '@/constants/conversation'
import type { ConversationMessage, AIVocabularyItem } from '@/types/conversation'
import { ConversationBubble } from './ConversationBubble'
import { ConversationInput } from './ConversationInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useSendMessage, useCompleteConversation } from '@/hooks/useConversation'
import { gooeyToast } from '@/components/ui/goey-toaster'

interface ConversationChatProps {
  conversationId: string
  initialMessages: ConversationMessage[]
  onEndConversation: () => void
  onBack: () => void
  isEnding: boolean
}

export function ConversationChat({
  conversationId,
  initialMessages,
  onEndConversation,
  onBack,
  isEnding,
}: ConversationChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [selectedVocab, setSelectedVocab] = useState<AIVocabularyItem | null>(null)

  const sendMessageMutation = useSendMessage(conversationId)
  const completeMutation = useCompleteConversation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const handleSend = async (userMessage: string) => {
    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'User',
      text: userMessage,
      suggestions: [],
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    try {
      const response = await sendMessageMutation.mutateAsync(userMessage)
      const aiMsg: ConversationMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: response.aiMessage.text,
        suggestions: response.aiMessage.suggestions || [],
        newVocabulary: response.aiMessage.newVocabulary,
        grammarPoints: response.aiMessage.grammarPoints,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      gooeyToast.error(CONVERSATION_COPY.sendFailed)
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  const handleEndClick = () => {
    setShowEndDialog(true)
  }

  const handleConfirmEnd = async () => {
    setShowEndDialog(false)
    try {
      await completeMutation.mutateAsync(conversationId)
      onEndConversation()
    } catch (error) {
      gooeyToast.error(CONVERSATION_COPY.completeFailed)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/50 bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onBack}
          >
            <ArrowLeftIcon size={18} />
          </Button>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {CONVERSATION_COPY.pageTitle}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleEndClick}
        >
          <StopCircleIcon size={16} className="mr-1" />
          {CONVERSATION_COPY.endConversation}
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((message) => (
            <ConversationBubble
              key={message.id}
              message={message}
              onSuggestionClick={handleSuggestionClick}
              onVocabularyClick={setSelectedVocab}
            />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  AI
                </div>
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-surface px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <ConversationInput
            onSend={handleSend}
            isLoading={isTyping}
          />
        </div>
      </div>

      {/* End Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{CONVERSATION_COPY.confirmEndTitle}</DialogTitle>
            <DialogDescription>
              {CONVERSATION_COPY.confirmEndMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              {CONVERSATION_COPY.cancel}
            </Button>
            <Button variant="default" onClick={handleConfirmEnd} disabled={isEnding}>
              {isEnding ? CONVERSATION_COPY.processing : CONVERSATION_COPY.endConversation}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vocabulary Detail Dialog */}
      <Dialog open={!!selectedVocab} onOpenChange={() => setSelectedVocab(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{CONVERSATION_COPY.newWord}</DialogTitle>
          </DialogHeader>
          {selectedVocab && (
            <div className="space-y-3 px-6 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {selectedVocab.word}
                </span>
                <span className="text-lg text-muted-foreground">({selectedVocab.reading})</span>
              </div>
              <p className="text-sm text-foreground">{selectedVocab.meaning}</p>
              {selectedVocab.example && (
                <div className="rounded-lg bg-surface-container-low p-3">
                  <p className="text-xs text-muted-foreground">Ví dụ:</p>
                  <p className="mt-1 text-sm italic text-foreground">
                    {selectedVocab.example}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
