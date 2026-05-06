import { useState, useRef, type FormEvent } from 'react'
import { PaperPlaneTiltIcon } from '@phosphor-icons/react'
import { CONVERSATION_COPY } from '@/constants/conversation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ConversationInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export function ConversationInput({ onSend, isLoading, disabled }: ConversationInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading || disabled) return
    onSend(message.trim())
    setMessage('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={CONVERSATION_COPY.chatPlaceholder}
          disabled={isLoading || disabled}
          className="min-h-12 max-h-32 resize-none rounded-xl border-border/50 bg-surface-container-low py-3 focus:border-primary focus:ring-1 focus:ring-primary"
          rows={1}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isLoading || disabled}
        className="h-12 w-12 shrink-0"
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <PaperPlaneTiltIcon size={20} weight="fill" />
        )}
      </Button>
    </form>
  )
}
