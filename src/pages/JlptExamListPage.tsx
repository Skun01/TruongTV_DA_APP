import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlassIcon, ClipboardTextIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useSearchParams } from 'react-router'
import { ExamCard } from '@/components/jlpt/ExamCard'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import { useJlptExams } from '@/hooks/useJlptExam'
import type { JlptLevel } from '@/types/jlptExam'

const PAGE_SIZE = 12

const LEVEL_OPTIONS: { value: JlptLevel | ''; label: string }[] = [
  { value: '', label: JLPT_EXAM_COPY.allLevels },
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
]

function ExamListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-surface-container-low">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-10" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
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
        <ClipboardTextIcon size={32} weight="duotone" className="text-tertiary" />
      </div>
      <p className="mt-4 text-center text-secondary">{JLPT_EXAM_COPY.emptyExams}</p>
    </div>
  )
}

export function JlptExamListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1') || 1
  const search = searchParams.get('keyword') ?? ''
  const level = (searchParams.get('level') ?? '') as JlptLevel | ''

  const [searchInput, setSearchInput] = useState(search)

  const params = useMemo(
    () => ({
      keyword: search || undefined,
      level: level || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [page, search, level],
  )

  const examsQuery = useJlptExams(params)
  const { items: exams, meta } = examsQuery.data ?? { items: [], meta: null }
  const totalPage = meta ? Math.ceil(meta.total / meta.pageSize) : 1

  useEffect(() => {
    if (examsQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [examsQuery.isFetching])

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams)
    if (searchInput) {
      newParams.set('keyword', searchInput)
    } else {
      newParams.delete('keyword')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleLevelChange = (newLevel: JlptLevel | '') => {
    const newParams = new URLSearchParams(searchParams)
    if (newLevel) {
      newParams.set('level', newLevel)
    } else {
      newParams.delete('level')
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
        <PageHelmet title={JLPT_EXAM_COPY.pageTitle} description={JLPT_EXAM_COPY.pageDescription} />

        <header>
          <h1 className="text-2xl font-bold text-foreground">{JLPT_EXAM_COPY.pageTitle}</h1>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary"
            />
            <Input
              placeholder={JLPT_EXAM_COPY.searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>

          <Select
            value={level || 'all'}
            onValueChange={(value) =>
              handleLevelChange(value === 'all' ? '' : (value as JlptLevel))
            }
          >
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
        </div>

        {examsQuery.isLoading ? (
          <ExamListSkeleton />
        ) : exams.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
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
                  {JLPT_EXAM_COPY.paginationPrev}
                </Button>
                <span className="text-sm text-secondary">
                  {JLPT_EXAM_COPY.paginationPage} {page} / {totalPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {JLPT_EXAM_COPY.paginationNext}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
