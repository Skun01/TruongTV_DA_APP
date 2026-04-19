import { useMemo, useState } from 'react'
import { CheckCircleIcon, FolderSimpleIcon, SpinnerGapIcon, StackSimpleIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'
import { useAddCardToFolder, useDeckDetail, useMyDecks, useRemoveCardFromFolder } from '@/hooks/useDecks'

interface AddToDeckDialogProps {
  open: boolean
  cardId: string
  onOpenChange: (open: boolean) => void
}

export function AddToDeckDialog({ open, cardId, onOpenChange }: AddToDeckDialogProps) {
  const navigate = useNavigate()
  const myDecksQuery = useMyDecks({ page: 1, pageSize: 100 }, open)
  const decks = useMemo(() => myDecksQuery.data?.items ?? [], [myDecksQuery.data?.items])
  const [manualDeckId, setManualDeckId] = useState<string | null>(null)
  const [manualFolderId, setManualFolderId] = useState<string | null>(null)

  const selectedDeckId = useMemo(() => {
    if (!open || decks.length === 0) {
      return ''
    }

    if (manualDeckId && decks.some((deck) => deck.id === manualDeckId)) {
      return manualDeckId
    }

    return decks[0].id
  }, [open, decks, manualDeckId])

  const deckDetailQuery = useDeckDetail(selectedDeckId, open && Boolean(selectedDeckId))
  const addCardMutation = useAddCardToFolder(selectedDeckId)
  const removeCardMutation = useRemoveCardFromFolder(selectedDeckId)

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) ?? null,
    [decks, selectedDeckId],
  )

  const sortedFolders = useMemo(
    () => deckDetailQuery.data?.folders.slice().sort((left, right) => left.position - right.position) ?? [],
    [deckDetailQuery.data?.folders],
  )

  const selectedFolderId = useMemo(() => {
    if (!open || sortedFolders.length === 0) {
      return ''
    }

    if (manualFolderId && sortedFolders.some((folder) => folder.id === manualFolderId)) {
      return manualFolderId
    }

    return sortedFolders[0].id
  }, [open, sortedFolders, manualFolderId])

  const currentFolderWithCard = useMemo(
    () =>
      sortedFolders.find((folder) =>
        folder.cards.some((item) => item.cardId === cardId),
      ) ?? null,
    [sortedFolders, cardId],
  )

  const isSubmitting = addCardMutation.isPending || removeCardMutation.isPending
  const hasDecks = decks.length > 0
  const hasFolders = sortedFolders.length > 0
  const isCardInDeck = Boolean(currentFolderWithCard)

  const handleOpenLibrary = () => {
    onOpenChange(false)
    navigate('/library?tab=myDecks')
  }

  const handleOpenDeckEditor = () => {
    if (!selectedDeck) return
    onOpenChange(false)
    navigate(`/library/my-decks/${selectedDeck.id}/edit`)
  }

  const handleSubmit = () => {
    if (!selectedDeckId) {
      return
    }

    if (isCardInDeck && currentFolderWithCard) {
      removeCardMutation.mutate(
        {
          folderId: currentFolderWithCard.id,
          cardId,
        },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
      return
    }

    if (!selectedFolderId) {
      return
    }

    addCardMutation.mutate(
      {
        folderId: selectedFolderId,
        payload: { cardId },
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="border-b border-border/70 px-6 py-5">
          <DialogTitle>{VOCAB_DETAIL_COPY.deckDialog.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          {myDecksQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-11 rounded-xl" />
              <Skeleton className="h-11 rounded-xl" />
            </div>
          ) : !hasDecks ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-5 text-center">
              <StackSimpleIcon size={20} className="mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">{VOCAB_DETAIL_COPY.deckDialog.emptyDeckTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{VOCAB_DETAIL_COPY.deckDialog.emptyDeckHint}</p>
              <Button type="button" variant="outline" className="mt-4" onClick={handleOpenLibrary}>
                {VOCAB_DETAIL_COPY.deckDialog.openLibrary}
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border/70 bg-card px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">{selectedDeck?.title ?? '—'}</span>
                  <Badge
                    variant={isCardInDeck ? 'secondary' : 'outline'}
                    className="gap-1 rounded-full border-border/70 px-2.5 py-1 text-[11px]"
                  >
                    <CheckCircleIcon size={14} />
                    {isCardInDeck
                      ? VOCAB_DETAIL_COPY.deckDialog.existedStatus
                      : VOCAB_DETAIL_COPY.deckDialog.readyStatus}
                  </Badge>
                </div>
              </div>

              {isCardInDeck && currentFolderWithCard && (
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5">
                  <FolderSimpleIcon size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">{currentFolderWithCard.title}</span>
                </div>
              )}

              <section className="space-y-2 rounded-2xl border border-border/70 bg-card/80 p-4 dark:bg-surface-container-high">
                <div className="flex items-center gap-2">
                  <StackSimpleIcon size={18} className="text-primary" />
                  <p className="text-sm font-semibold text-foreground">{VOCAB_DETAIL_COPY.deckDialog.deckLabel}</p>
                </div>
                <p className="text-xs text-muted-foreground">{VOCAB_DETAIL_COPY.deckDialog.deckHint}</p>
                <Select
                  value={selectedDeckId}
                  onValueChange={(nextDeckId) => {
                    setManualDeckId(nextDeckId)
                    setManualFolderId(null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={VOCAB_DETAIL_COPY.deckDialog.deckPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {decks.map((deck) => (
                      <SelectItem key={deck.id} value={deck.id}>
                        {deck.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              {deckDetailQuery.isLoading ? (
                <Skeleton className="h-11 rounded-xl" />
              ) : (
                <section className="space-y-2 rounded-2xl border border-border/70 bg-card/80 p-4 dark:bg-surface-container-high">
                  <div className="flex items-center gap-2">
                    <FolderSimpleIcon size={18} className="text-primary" />
                    <p className="text-sm font-semibold text-foreground">{VOCAB_DETAIL_COPY.deckDialog.folderLabel}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{VOCAB_DETAIL_COPY.deckDialog.folderHint}</p>
                  <Select
                    value={selectedFolderId}
                    onValueChange={setManualFolderId}
                    disabled={!hasFolders || isCardInDeck}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={VOCAB_DETAIL_COPY.deckDialog.folderPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedFolders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!hasFolders && (
                    <Button type="button" variant="secondary" className="w-full" onClick={handleOpenDeckEditor}>
                      {VOCAB_DETAIL_COPY.deckDialog.openDeckEditor}
                    </Button>
                  )}
                </section>
              )}
            </>
          )}
        </div>

        <DialogFooter className="border-t border-border/70 px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {VOCAB_DETAIL_COPY.deckDialog.cancel}
          </Button>
          {!hasDecks ? null : (
            <Button
              type="button"
              onClick={hasFolders ? handleSubmit : handleOpenDeckEditor}
              disabled={
                isSubmitting ||
                (hasFolders
                  ? deckDetailQuery.isLoading || (!selectedFolderId && !isCardInDeck)
                  : false)
              }
              className="gap-2"
            >
              {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
              {hasFolders
                ? isCardInDeck
                  ? VOCAB_DETAIL_COPY.deckDialog.removeAction
                  : VOCAB_DETAIL_COPY.deckDialog.addAction
                : VOCAB_DETAIL_COPY.deckDialog.openDeckEditor}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
