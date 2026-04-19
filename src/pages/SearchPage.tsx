import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import NProgress from 'nprogress'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchHeader } from '@/components/search/SearchHeader'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { SearchEmptyState } from '@/components/search/SearchEmptyState'
import { useCardSearch } from '@/hooks/useCardSearch'
import { SEARCH_COPY } from '@/constants/search'
import type { SearchCardSummary, SearchCardType } from '@/types/search'
import type { JlptLevel } from '@/types/vocabulary'

const SEARCH_SECTIONS: Array<{
  key: SearchCardType
  label: string
}> = [
  { key: 'Vocab', label: SEARCH_COPY.cardTypeLabel.Vocab },
  { key: 'Grammar', label: SEARCH_COPY.cardTypeLabel.Grammar },
  { key: 'Kanji', label: SEARCH_COPY.cardTypeLabel.Kanji },
]

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [selectedCardType, setSelectedCardType] = useState<SearchCardType | undefined>()
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel | undefined>()

  const searchQueryParams = useMemo(
    () => ({
      q: submittedQuery,
      cardType: selectedCardType,
      level: selectedLevel,
      page: 1,
      pageSize: 20,
    }),
    [submittedQuery, selectedCardType, selectedLevel],
  )

  const { data, isFetching, isError } = useCardSearch(
    searchQueryParams,
    Boolean(submittedQuery.trim()),
  )

  const results = data?.data ?? []
  const totalResults = data?.metaData?.total ?? results.length
  const groupedResults = useMemo(
    () =>
      SEARCH_SECTIONS.map((section) => ({
        ...section,
        items: results.filter((card) => card.cardType === section.key),
      })).sort((left, right) => right.items.length - left.items.length),
    [results],
  )

  useEffect(() => {
    if (isError) {
      gooeyToast.error(SEARCH_COPY.searchError)
    }
  }, [isError])

  useEffect(() => {
    if (isFetching) {
      NProgress.start()
      return
    }

    NProgress.done()
  }, [isFetching])

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSubmittedQuery('')
      return
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: true })
    setSubmittedQuery(trimmed)
  }

  useEffect(() => {
    setQuery(initialQuery)
    setSubmittedQuery(initialQuery)
  }, [initialQuery])

  function renderResultState(items: SearchCardSummary[], sectionLabel: string) {
    if (isFetching) {
      return (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-3xl" />
          ))}
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="rounded-3xl border border-border/70 bg-card px-6 py-8 text-center shadow-[0_2px_12px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.24)]">
          <p className="text-sm text-muted-foreground">
            {SEARCH_COPY.emptySection(sectionLabel, submittedQuery)}
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {items.map((card) => (
          <SearchResultCard key={card.id} card={card} />
        ))}
      </div>
    )
  }

  return (
    <>
      <PageHelmet
        title={SEARCH_COPY.pageTitle}
        description={SEARCH_COPY.pageDescription}
      />
      <AppLayout
        mainClassName="min-h-screen pt-20 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 py-8">
            <SearchHeader
              query={query}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
            />

            {!submittedQuery.trim() ? (
              <p className="py-24 text-center text-sm text-muted-foreground">
                {SEARCH_COPY.emptyQuery}
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {SEARCH_COPY.resultCount(totalResults, submittedQuery)}
                  </p>
                  <SearchFilters
                    selectedCardType={selectedCardType}
                    selectedLevel={selectedLevel}
                    onCardTypeChange={setSelectedCardType}
                    onLevelChange={setSelectedLevel}
                  />
                </div>

                {!isFetching && results.length === 0 ? (
                  <SearchEmptyState />
                ) : (
                  <div className="flex flex-col gap-8">
                    {groupedResults
                      .filter(
                        (section) =>
                          selectedCardType === undefined || section.key === selectedCardType,
                      )
                      .map((section) => (
                        <section key={section.key}>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              {section.label}
                            </h2>
                            {!isFetching && section.items.length > 0 && (
                              <span className="text-xs font-medium text-muted-foreground">
                                {SEARCH_COPY.sectionCount(section.items.length)}
                              </span>
                            )}
                          </div>
                          {renderResultState(section.items, section.label)}
                        </section>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  )
}
