import { useMemo, useRef, useEffect } from 'react'
import { useParams } from 'react-router'
import { ArrowLeftIcon, WarningCircleIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useAuthStore } from '@/stores/authStore'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { CardHero } from '@/components/card/CardHero'
import { CardProgress } from '@/components/card/CardProgress'
import { CardNoteSection } from '@/components/card/CardNoteSection'
import { CardExamples } from '@/components/card/CardExamples'
import { CardCommunityNotes } from '@/components/card/CardCommunityNotes'
import { GrammarDetailCard } from '@/components/grammar/GrammarDetailCard'
import { GrammarRelations } from '@/components/grammar/GrammarRelations'
import { GrammarResources } from '@/components/grammar/GrammarResources'
import { GRAMMAR_DETAIL_COPY } from '@/constants/grammarDetail'
import { useGrammarDetail } from '@/hooks/useGrammarDetail'

export function GrammarDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isFetching, isError, refetch } = useGrammarDetail(id)
  const currentUserId = useAuthStore((state) => state.user?.id ?? null)
  const communityNotesRef = useRef<HTMLDivElement>(null)
  const card = data?.success ? data.data : null
  const notFound = !isLoading && !card

  useEffect(() => {
    if (isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [isFetching])

  useEffect(() => {
    if (isError) {
      gooeyToast.error(GRAMMAR_DETAIL_COPY.errorLoading)
    }
  }, [isError])

  const myNote = useMemo(
    () => (currentUserId ? card?.userNotes.find((note) => note.userId === currentUserId) ?? null : null),
    [card?.userNotes, currentUserId],
  )

  const communityNotes = useMemo(
    () => (currentUserId ? card?.userNotes.filter((note) => note.userId !== currentUserId) ?? [] : card?.userNotes ?? []),
    [card?.userNotes, currentUserId],
  )

  const handleNotesChanged = () => {
    void refetch()
  }

  const scrollToCommunityNotes = () => {
    communityNotesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHelmet
        title={card ? GRAMMAR_DETAIL_COPY.pageTitle(card.title) : GRAMMAR_DETAIL_COPY.notFound}
        description={card?.summary ?? GRAMMAR_DETAIL_COPY.pageDescription}
      />
      <AppLayout
        mainClassName="min-h-screen pt-20 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-1.5 text-primary"
            >
              <ArrowLeftIcon size={16} weight="bold" />
              {GRAMMAR_DETAIL_COPY.back}
            </Button>
          </div>

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

          {notFound && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <WarningCircleIcon size={48} weight="duotone" className="text-muted-foreground opacity-50" />
              <p className="font-heading-vn text-lg font-semibold text-foreground">
                {GRAMMAR_DETAIL_COPY.notFound}
              </p>
              <p className="text-sm text-center max-w-xs text-muted-foreground">
                {GRAMMAR_DETAIL_COPY.notFoundHint}
              </p>
            </div>
          )}

          {card && !isLoading && (
            <div className="flex flex-col gap-8 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div className="flex flex-col gap-6">
                  <CardHero
                    level={card.level}
                    typeLabel={GRAMMAR_DETAIL_COPY.cardType}
                    title={card.title}
                    summary={card.summary}
                  />

                  <GrammarDetailCard card={card} />
                </div>

                <div className="flex flex-col gap-4">
                  <CardProgress cardId={card.id} />
                  <CardNoteSection
                    cardId={card.id}
                    myNote={myNote}
                    onNotesChanged={handleNotesChanged}
                    onScrollToNotes={scrollToCommunityNotes}
                  />
                </div>
              </div>

              <CardExamples sentences={card.sentences} />
              <GrammarRelations relations={card.relations} />
              <GrammarResources resources={card.resources} />

              <div ref={communityNotesRef}>
                <CardCommunityNotes
                  communityNotes={communityNotes}
                  onNotesChanged={handleNotesChanged}
                />
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  )
}
