import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlassIcon, MicrophoneIcon, CrownIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useSearchParams } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { SHADOWING_COPY } from '@/constants/shadowing'
import { useShadowingTopics } from '@/hooks/useShadowing'
import type { ShadowingLevel, ShadowingTopicListItemResponse } from '@/types/shadowing'

const PAGE_SIZE = 12

const LEVEL_OPTIONS: { value: ShadowingLevel | ''; label: string }[] = [
  { value: '', label: SHADOWING_COPY.allLevels },
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
]

function TopicCard({ topic }: { topic: ShadowingTopicListItemResponse }) {
  const navigate = useNavigate()

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 bg-surface-container-low transition-all hover:border-primary/30 hover:shadow-md"
      onClick={() => navigate(`/shadowing/topics/${topic.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            {topic.coverImageUrl ? (
              <img
                src={topic.coverImageUrl}
                alt={topic.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <MicrophoneIcon size={32} weight="duotone" className="text-primary/60" />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-semibold text-primary transition-all group-hover:font-bold group-hover:text-primary/80">
                {topic.title}
              </h3>
              {topic.isOfficial && (
                <CrownIcon size={16} weight="fill" className="shrink-0 text-amber-500" />
              )}
            </div>

            <p className="mt-1 line-clamp-2 text-xs text-secondary">
              {topic.description}
            </p>

            <div className="mt-auto flex items-center gap-2 pt-2">
              {topic.level && (
                <Badge variant="secondary" className="text-xs">
                  {topic.level}
                </Badge>
              )}
              <span className="text-xs text-tertiary">
                {topic.sentencesCount} {SHADOWING_COPY.sentencesCount}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TopicsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-surface-container-low">
          <CardContent className="flex gap-4 p-4">
            <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-surface-container-low py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <MicrophoneIcon size={32} weight="duotone" className="text-tertiary" />
      </div>
      <p className="mt-4 text-center text-secondary">{SHADOWING_COPY.emptyTopics}</p>
    </div>
  )
}

export function ShadowingListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1') || 1
  const search = searchParams.get('q') ?? ''
  const level = (searchParams.get('level') ?? '') as ShadowingLevel | ''
  const officialOnly = searchParams.get('officialOnly') === 'true'

  const [searchInput, setSearchInput] = useState(search)

  const params = useMemo(
    () => ({
      q: search || undefined,
      level: level || undefined,
      officialOnly: officialOnly || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [page, search, level, officialOnly],
  )

  const topicsQuery = useShadowingTopics(params)
  const { items: topics, totalPage } = topicsQuery.data ?? { items: [], total: 0, totalPage: 1 }

  useEffect(() => {
    if (topicsQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [topicsQuery.isFetching])

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams)
    if (searchInput) {
      newParams.set('q', searchInput)
    } else {
      newParams.delete('q')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleLevelChange = (newLevel: ShadowingLevel | '') => {
    const newParams = new URLSearchParams(searchParams)
    if (newLevel) {
      newParams.set('level', newLevel)
    } else {
      newParams.delete('level')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleOfficialToggle = () => {
    const newParams = new URLSearchParams(searchParams)
    if (officialOnly) {
      newParams.delete('officialOnly')
    } else {
      newParams.set('officialOnly', 'true')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', String(newPage))
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AppLayout
      mainClassName="min-h-screen pt-24 pb-16"
      mainStyle={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:px-8">
        <header>
          <h1 className="text-2xl font-bold text-foreground">{SHADOWING_COPY.pageTitle}</h1>
          <p className="mt-1 text-secondary">{SHADOWING_COPY.pageDescription}</p>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary"
            />
            <Input
              placeholder={SHADOWING_COPY.searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={level || 'all'} onValueChange={(value) => handleLevelChange(value === 'all' ? '' : (value as ShadowingLevel))}>
              <SelectTrigger className="h-9 w-auto min-w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={officialOnly ? 'default' : 'outline'}
              size="sm"
              onClick={handleOfficialToggle}
              className="shrink-0"
            >
              <CrownIcon size={16} weight={officialOnly ? 'fill' : 'regular'} className="mr-1" />
              {SHADOWING_COPY.officialOnly}
            </Button>
          </div>
        </div>

        {topicsQuery.isLoading ? (
          <TopicsSkeleton />
        ) : topics.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>

            {totalPage > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  {SHADOWING_COPY.paginationPrev}
                </Button>
                <span className="text-sm text-secondary">
                  {SHADOWING_COPY.paginationPage} {page} / {totalPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {SHADOWING_COPY.paginationNext}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
