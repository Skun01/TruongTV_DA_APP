import { BooksIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { DeckListItemResponse } from '@/types/deck'
import { QuickLearnDeckCard } from './QuickLearnDeckCard'

interface QuickLearnDeckListProps {
  title: string
  decks: DeckListItemResponse[]
  isLoading: boolean
  emptyMessage: string
  selectedDeckId: string | null
  onSelectDeck: (deckId: string) => void
}

export function QuickLearnDeckList({
  title,
  decks,
  isLoading,
  emptyMessage,
  selectedDeckId,
  onSelectDeck,
}: QuickLearnDeckListProps) {
  return (
    <section className="space-y-4">
      <h2 className="section-title-text flex items-center gap-2">
        <BooksIcon size={20} weight="duotone" />
        {title}
      </h2>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl feature-card"
            />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl px-6 py-10 feature-card"
        >
          <BooksIcon size={32} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          <a
            href="/library"
            className="mt-1 text-sm font-semibold text-primary hover:underline"
          >
            {LEARNING_COPY.goToLibrary}
          </a>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <QuickLearnDeckCard
              key={deck.id}
              deck={deck}
              isSelected={selectedDeckId === deck.id}
              onSelect={() => onSelectDeck(deck.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
