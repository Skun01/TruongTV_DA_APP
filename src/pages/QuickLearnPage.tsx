import { useState, useMemo, useCallback } from 'react'
import { ArrowLeftIcon, LightningIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import { QuickLearnDeckList } from '@/components/learning/QuickLearnDeckList'
import { FolderCardSelector } from '@/components/learning/FolderCardSelector'
import { StudyModeSelector } from '@/components/learning/StudyModeSelector'
import { StudySettingsPanel } from '@/components/learning/StudySettingsPanel'
import { LEARNING_COPY } from '@/constants/learning'
import { useBookmarkedDecks, useMyDecks, useDeckDetail } from '@/hooks/useDecks'
import { useCreateSession, useLearningSettings } from '@/hooks/useLearning'
import type { StudyMode, StudySessionSettingsRequest } from '@/types/learning'

export function QuickLearnPage() {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set())
  const [selectedMode, setSelectedMode] = useState<StudyMode>('MultipleChoice')
  const [settings, setSettings] = useState<StudySessionSettingsRequest>({})

  const bookmarkedParams = useMemo(() => ({ pageSize: 50 }), [])
  const myDecksParams = useMemo(() => ({ pageSize: 50 }), [])

  const bookmarkedQuery = useBookmarkedDecks(bookmarkedParams)
  const myDecksQuery = useMyDecks(myDecksParams)
  const deckDetailQuery = useDeckDetail(selectedDeckId ?? '', Boolean(selectedDeckId))
  const createSessionMutation = useCreateSession()
  const settingsQuery = useLearningSettings()

  const isPageLoading =
    bookmarkedQuery.isFetching || myDecksQuery.isFetching
  const isDeckLoading = deckDetailQuery.isFetching

  // Sync settings from server once available
  useEffect(() => {
    if (settingsQuery.data) {
      setSettings({
        flashcardFront: settingsQuery.data.flashcardFront,
        flashcardBack: settingsQuery.data.flashcardBack,
        multipleChoiceQuestion: settingsQuery.data.multipleChoiceQuestion,
        shuffleOptions: settingsQuery.data.shuffleOptions,
      })
    }
  }, [settingsQuery.data])

  useEffect(() => {
    if (isPageLoading || isDeckLoading) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [isPageLoading, isDeckLoading])

  // Auto-select all cards when deck detail loads
  useEffect(() => {
    if (deckDetailQuery.data) {
      const allCardIds = deckDetailQuery.data.folders.flatMap((f) =>
        f.cards.map((c) => c.cardId),
      )
      setSelectedCardIds(new Set(allCardIds))
    }
  }, [deckDetailQuery.data])

  const handleSelectDeck = useCallback((deckId: string) => {
    setSelectedDeckId(deckId)
    setSelectedCardIds(new Set())
  }, [])

  const handleBackToDecks = useCallback(() => {
    setSelectedDeckId(null)
    setSelectedCardIds(new Set())
  }, [])

  function handleStartSession() {
    if (selectedCardIds.size === 0) return

    createSessionMutation.mutate({
      deckId: selectedDeckId,
      cardIds: Array.from(selectedCardIds),
      mode: selectedMode,
      settings: Object.keys(settings).length > 0 ? settings : null,
    })
  }

  const deck = deckDetailQuery.data

  return (
    <>
      <PageHelmet
        title={LEARNING_COPY.pageTitle}
        description={LEARNING_COPY.pageDescription}
      />
      <AppLayout
        mainClassName="min-h-screen pt-24 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            {selectedDeckId && (
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={handleBackToDecks}
              >
                <ArrowLeftIcon size={18} />
                {LEARNING_COPY.backToDecks}
              </Button>
            )}
            <h1 className="text-2xl font-bold text-foreground">
              {LEARNING_COPY.heading}
            </h1>
          </div>

          {/* Step 1: Choose deck */}
          {!selectedDeckId && (
            <>
              <QuickLearnDeckList
                title={LEARNING_COPY.bookmarkedDecksSection}
                decks={bookmarkedQuery.data?.items ?? []}
                isLoading={bookmarkedQuery.isLoading}
                emptyMessage={LEARNING_COPY.emptyBookmarked}
                selectedDeckId={selectedDeckId}
                onSelectDeck={handleSelectDeck}
              />
              <QuickLearnDeckList
                title={LEARNING_COPY.myDecksSection}
                decks={myDecksQuery.data?.items ?? []}
                isLoading={myDecksQuery.isLoading}
                emptyMessage={LEARNING_COPY.emptyMyDecks}
                selectedDeckId={selectedDeckId}
                onSelectDeck={handleSelectDeck}
              />
            </>
          )}

          {/* Step 2: Select cards + mode + settings (single-page accordion) */}
          {selectedDeckId && deck && (
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Left — Card selector */}
              <div className="lg:col-span-3">
                <FolderCardSelector
                  deck={deck}
                  selectedCardIds={selectedCardIds}
                  onSelectionChange={setSelectedCardIds}
                />
              </div>

              {/* Right — Mode + settings + start */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                <StudyModeSelector
                  value={selectedMode}
                  onChange={setSelectedMode}
                />

                <StudySettingsPanel
                  mode={selectedMode}
                  settings={settings}
                  onSettingsChange={setSettings}
                />

                {/* Start button */}
                <Button
                  onClick={handleStartSession}
                  disabled={
                    selectedCardIds.size === 0 ||
                    createSessionMutation.isPending
                  }
                  className="w-full rounded-full py-6 text-base"
                  size="lg"
                >
                  {createSessionMutation.isPending ? (
                    <SpinnerGapIcon size={20} className="animate-spin" />
                  ) : (
                    <LightningIcon size={20} weight="fill" />
                  )}
                  {selectedCardIds.size === 0
                    ? LEARNING_COPY.noCardsSelected
                    : `${LEARNING_COPY.startSession} (${selectedCardIds.size} ${LEARNING_COPY.cardsCount})`}
                </Button>
              </div>
            </div>
          )}

          {/* Deck loading state */}
          {selectedDeckId && isDeckLoading && (
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="space-y-3 lg:col-span-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-2xl section-card-surface"
                  />
                ))}
              </div>
              <div className="space-y-3 lg:col-span-2">
                <div className="h-40 animate-pulse rounded-2xl section-card-surface" />
                <div className="h-12 animate-pulse rounded-full section-card-surface" />
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  )
}
