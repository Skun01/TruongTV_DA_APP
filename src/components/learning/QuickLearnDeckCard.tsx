import { FoldersIcon, StackIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { DeckListItemResponse } from '@/types/deck'

interface QuickLearnDeckCardProps {
  deck: DeckListItemResponse
  isSelected: boolean
  onSelect: () => void
}

export function QuickLearnDeckCard({
  deck,
  isSelected,
  onSelect,
}: QuickLearnDeckCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full flex-col gap-3 rounded-2xl p-4 text-left transition-all duration-200 ${
        isSelected
          ? 'feature-card-selected'
          : 'feature-card hover:feature-card-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        {deck.coverImageUrl ? (
          <img
            src={deck.coverImageUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'var(--surface-container-highest)' }}
          >
            <StackIcon size={20} className="text-muted-foreground/60" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">
            {deck.title}
          </p>
          {deck.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {deck.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FoldersIcon size={14} />
          {deck.foldersCount} {LEARNING_COPY.foldersCount}
        </span>
        <span className="flex items-center gap-1">
          <StackIcon size={14} />
          {deck.cardsCount} {LEARNING_COPY.cardsCount}
        </span>
      </div>
    </button>
  )
}
