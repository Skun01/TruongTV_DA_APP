import { useRef, useMemo } from 'react'
import { useParams } from 'react-router'
import { ArrowLeftIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { CardHero } from '@/components/card/CardHero'
import { CardProgress } from '@/components/card/CardProgress'
import { CardNoteSection } from '@/components/card/CardNoteSection'
import { CardExamples } from '@/components/card/CardExamples'
import { VocabRelated } from '@/components/vocabulary/VocabRelated'
import { CardCommunityNotes } from '@/components/card/CardCommunityNotes'
import { VocabDetailCard } from '@/components/vocabulary/VocabDetailCard'
import { useVocabularyDetail } from '@/hooks/useVocabularyDetail'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'

export function VocabularyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { card, isLoading, notFound, refetch } = useVocabularyDetail(id)
  const currentUserId = useAuthStore((state) => state.user?.id ?? null)
  const communityNotesRef = useRef<HTMLDivElement>(null)

  const scrollToCommunityNotes = () => {
    communityNotesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const myNote = useMemo(
    () => (currentUserId ? card?.userNotes.find((n) => n.userId === currentUserId) ?? null : null),
    [card?.userNotes, currentUserId],
  )

  const communityNotes = useMemo(
    () => (currentUserId ? card?.userNotes.filter((n) => n.userId !== currentUserId) ?? [] : card?.userNotes ?? []),
    [card?.userNotes, currentUserId],
  )

  return (
    <>
      <PageHelmet
        title={card ? VOCAB_DETAIL_COPY.pageTitle(card.writing) : VOCAB_DETAIL_COPY.notFound}
        description={card?.summary}
      />
      <AppLayout
        mainClassName="min-h-screen pt-20 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-1.5 text-primary"
            >
              <ArrowLeftIcon size={16} weight="bold" />
              {VOCAB_DETAIL_COPY.back}
            </Button>
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 py-4">
              <div className="flex flex-col gap-6">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
              <div className="flex flex-col gap-4">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          )}

          {/* Not found */}
          {notFound && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <WarningCircleIcon size={48} weight="duotone" className="text-muted-foreground opacity-50" />
              <p className="font-heading-vn text-lg font-semibold text-foreground">
                {VOCAB_DETAIL_COPY.notFound}
              </p>
              <p className="text-sm text-center max-w-xs text-muted-foreground">
                {VOCAB_DETAIL_COPY.notFoundHint}
              </p>
            </div>
          )}

          {/* Card loaded */}
          {card && !isLoading && (
            <div className="flex flex-col gap-8 py-4">
              {/* TOP: 2-column layout  */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                {/* Left column */}
                <div className="flex flex-col gap-6">
                  <CardHero
                    level={card.level}
                    typeLabel={VOCAB_DETAIL_COPY.cardType}
                    title={card.writing}
                    summary={card.summary}
                  />
                  <VocabDetailCard card={card} />
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                  <CardProgress cardId={card.id} />
                  <CardNoteSection
                    cardId={card.id}
                    myNote={myNote}
                    onNotesChanged={refetch}
                    onScrollToNotes={scrollToCommunityNotes}
                  />
                </div>
              </div>

              {/* BOTTOM: Full-width sections */}
              <CardExamples sentences={card.sentences} />

              <VocabRelated
                synonyms={card.synonyms}
                antonyms={card.antonyms}
                relatedPhrases={card.relatedPhrases}
              />

              <div ref={communityNotesRef}>
                <CardCommunityNotes
                  communityNotes={communityNotes}
                  onNotesChanged={refetch}
                />
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  )
}
