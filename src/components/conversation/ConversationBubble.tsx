import { CONVERSATION_COPY } from '@/constants/conversation'
import type { ConversationMessage, AIVocabularyItem } from '@/types/conversation'
import { UserIcon } from '@phosphor-icons/react'

interface ConversationBubbleProps {
  message: ConversationMessage
  onSuggestionClick?: (suggestion: string) => void
  onVocabularyClick?: (vocab: AIVocabularyItem) => void
}

export function ConversationBubble({
  message,
  onSuggestionClick,
  onVocabularyClick,
}: ConversationBubbleProps) {
  const isUser = message.sender === 'User'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          {isUser ? (
            <UserIcon size={16} weight="bold" />
          ) : (
            <span>AI</span>
          )}
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-container-low text-foreground'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>

          {/* Suggestions (AI only) */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`${CONVERSATION_COPY.sendMessage}: ${suggestion}`}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/10"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* New Vocabulary (AI only) */}
          {message.newVocabulary && message.newVocabulary.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {CONVERSATION_COPY.newWord}:
              </p>
              <div className="flex flex-wrap gap-2">
                {message.newVocabulary.map((vocab, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onVocabularyClick?.(vocab)}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-700 dark:text-amber-400 transition-colors hover:bg-amber-500/20"
                  >
                    {vocab.word} ({vocab.reading})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Points (AI only) */}
          {message.grammarPoints && message.grammarPoints.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {CONVERSATION_COPY.grammarPoint}:
              </p>
              <div className="flex flex-wrap gap-2">
                {message.grammarPoints.map((grammar, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-700 dark:text-blue-400"
                  >
                    {grammar}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
