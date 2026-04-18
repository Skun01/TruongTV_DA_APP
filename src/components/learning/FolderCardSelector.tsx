import { useState, useMemo } from 'react'
import { CaretDownIcon, CheckSquareIcon, SquareIcon, StackIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import { DECK_COPY } from '@/constants/deck'
import type { DeckDetailResponse, DeckFolderResponse } from '@/types/deck'

interface FolderCardSelectorProps {
  deck: DeckDetailResponse
  selectedCardIds: Set<string>
  onSelectionChange: (cardIds: Set<string>) => void
}

export function FolderCardSelector({
  deck,
  selectedCardIds,
  onSelectionChange,
}: FolderCardSelectorProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    const folders = deck.folders.slice().sort((a, b) => a.position - b.position)
    return new Set(folders.length > 0 ? [folders[0].id] : [])
  })

  const sortedFolders = useMemo(
    () => deck.folders.slice().sort((a, b) => a.position - b.position),
    [deck.folders],
  )

  const allCardIds = useMemo(
    () =>
      sortedFolders.flatMap((f) =>
        f.cards.map((c) => c.cardId),
      ),
    [sortedFolders],
  )

  const allSelected = allCardIds.length > 0 && allCardIds.every((id) => selectedCardIds.has(id))

  function toggleFolder(folderId: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  function toggleAllCards() {
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(allCardIds))
    }
  }

  function toggleFolderCards(folder: DeckFolderResponse) {
    const folderCardIds = folder.cards.map((c) => c.cardId)
    const allFolderSelected = folderCardIds.every((id) => selectedCardIds.has(id))
    const next = new Set(selectedCardIds)
    folderCardIds.forEach((id) => {
      if (allFolderSelected) {
        next.delete(id)
      } else {
        next.add(id)
      }
    })
    onSelectionChange(next)
  }

  function toggleCard(cardId: string) {
    const next = new Set(selectedCardIds)
    if (next.has(cardId)) {
      next.delete(cardId)
    } else {
      next.add(cardId)
    }
    onSelectionChange(next)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="section-label-text">{LEARNING_COPY.selectCardsTitle}</h3>
        <button
          type="button"
          onClick={toggleAllCards}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          {allSelected ? LEARNING_COPY.deselectAll : LEARNING_COPY.selectAll}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedCardIds.size} / {allCardIds.length} {LEARNING_COPY.selectedCount}
      </p>

      <div className="space-y-2">
        {sortedFolders.map((folder) => {
          const isExpanded = expandedFolders.has(folder.id)
          const sortedCards = folder.cards
            .slice()
            .sort((a, b) => a.position - b.position)
          const folderCardIds = folder.cards.map((c) => c.cardId)
          const allFolderSelected =
            folderCardIds.length > 0 &&
            folderCardIds.every((id) => selectedCardIds.has(id))
          const someFolderSelected =
            !allFolderSelected &&
            folderCardIds.some((id) => selectedCardIds.has(id))

          return (
            <div
              key={folder.id}
              className="overflow-hidden rounded-2xl feature-card"
            >
              {/* Folder header */}
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleFolderCards(folder)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center"
                  aria-label={
                    allFolderSelected
                      ? LEARNING_COPY.deselectAll
                      : LEARNING_COPY.selectAll
                  }
                >
                  {allFolderSelected ? (
                    <CheckSquareIcon
                      size={18}
                      weight="fill"
                      className="text-primary"
                    />
                  ) : someFolderSelected ? (
                    <CheckSquareIcon
                      size={18}
                      weight="duotone"
                      className="text-primary/60"
                    />
                  ) : (
                    <SquareIcon size={18} className="text-muted-foreground/50" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleFolder(folder.id)}
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <span className="truncate text-sm font-semibold text-foreground">
                    {folder.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    ({folder.cardsCount} {LEARNING_COPY.cardsCount})
                  </span>
                  <CaretDownIcon
                    size={14}
                    className={`ml-auto shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Card list */}
              {isExpanded && (
                <div className="border-t border-border/60 px-4 py-2">
                  {sortedCards.length === 0 ? (
                    <p className="py-3 text-center text-xs text-muted-foreground">
                      {LEARNING_COPY.noCardsInFolder}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {sortedCards.map((item) => {
                        const card = item.card
                        const isCardSelected = selectedCardIds.has(item.cardId)

                        return (
                          <button
                            key={item.cardId}
                            type="button"
                            onClick={() => toggleCard(item.cardId)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                              isCardSelected
                                ? 'bg-primary/5 dark:bg-primary/10'
                                : 'hover:bg-accent/50'
                            }`}
                          >
                            {isCardSelected ? (
                              <CheckSquareIcon
                                size={16}
                                weight="fill"
                                className="shrink-0 text-primary"
                              />
                            ) : (
                              <SquareIcon
                                size={16}
                                className="shrink-0 text-muted-foreground/40"
                              />
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">
                                {card.title}
                              </p>
                              {card.summary && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {card.summary}
                                </p>
                              )}
                            </div>

                            <span
                              className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                              style={{
                                backgroundColor: 'var(--surface-container-highest)',
                                color: 'var(--on-surface-variant)',
                              }}
                            >
                              {DECK_COPY.cardTypeLabels[card.cardType as keyof typeof DECK_COPY.cardTypeLabels] ??
                                card.cardType}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {sortedFolders.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl px-6 py-10 feature-card">
            <StackIcon size={28} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {DECK_COPY.emptyFolders}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
