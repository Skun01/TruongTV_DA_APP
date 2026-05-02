import { useEffect, useMemo } from 'react'
import { ClockCountdownIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useSearchParams } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'
import { useExamSessionHistory } from '@/hooks/useJlptExam'
import type { ExamSessionHistoryItemResponse, ExamSessionStatus } from '@/types/jlptExam'

const PAGE_SIZE = 20

const STATUS_OPTIONS: { value: ExamSessionStatus | ''; label: string }[] = [
  { value: '', label: JLPT_EXAM_COPY.allStatuses },
  { value: 'InProgress', label: JLPT_EXAM_COPY.statusLabels.InProgress },
  { value: 'Submitted', label: JLPT_EXAM_COPY.statusLabels.Submitted },
  { value: 'TimedOut', label: JLPT_EXAM_COPY.statusLabels.TimedOut },
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function statusVariant(status: ExamSessionStatus): 'default' | 'secondary' | 'destructive' {
  if (status === 'Submitted') return 'default'
  if (status === 'TimedOut') return 'destructive'
  return 'secondary'
}

function HistoryCard({ item }: { item: ExamSessionHistoryItemResponse }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (item.status === 'InProgress') {
      navigate(`/jlpt/session/${item.sessionId}`)
    } else {
      navigate(`/jlpt/session/${item.sessionId}/result`)
    }
  }

  return (
    <Card
      className="group cursor-pointer border-border/50 bg-surface-container-low transition-all hover:border-primary/30 hover:shadow-md"
      onClick={handleClick}
    >
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-primary transition-all group-hover:font-bold group-hover:text-primary/80">
              {item.examTitle}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {item.level}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-secondary">
            <Badge variant={statusVariant(item.status)} className="text-xs">
              {JLPT_EXAM_COPY.statusLabels[item.status]}
            </Badge>

            {item.totalScore !== null && (
              <span className="font-medium">
                {item.totalScore} {JLPT_EXAM_COPY.scoreLabel}
              </span>
            )}

            {item.isPassed !== null && (
              <Badge
                variant={item.isPassed ? 'default' : 'destructive'}
                className="text-xs"
              >
                {item.isPassed ? JLPT_EXAM_COPY.passed : JLPT_EXAM_COPY.failed}
              </Badge>
            )}

            <span>{JLPT_EXAM_COPY.startedAt}: {formatDate(item.startedAt)}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="shrink-0">
          {item.status === 'InProgress'
            ? JLPT_EXAM_COPY.continueSession
            : JLPT_EXAM_COPY.viewResultAction}
        </Button>
      </CardContent>
    </Card>
  )
}

function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-surface-container-low">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyHistoryState() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-surface-container-low py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <ClockCountdownIcon size={32} weight="duotone" className="text-tertiary" />
      </div>
      <p className="mt-4 text-center text-secondary">{JLPT_EXAM_COPY.emptyHistory}</p>
      <Button className="mt-4" onClick={() => navigate('/jlpt')}>
        {JLPT_EXAM_COPY.goToExams}
      </Button>
    </div>
  )
}

export function JlptExamHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1') || 1
  const status = (searchParams.get('status') ?? '') as ExamSessionStatus | ''

  const params = useMemo(
    () => ({
      status: status || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [page, status],
  )

  const historyQuery = useExamSessionHistory(params)
  const { items, meta } = historyQuery.data ?? { items: [], meta: null }
  const totalPage = meta ? Math.ceil(meta.total / meta.pageSize) : 1

  useEffect(() => {
    if (historyQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [historyQuery.isFetching])

  const handleStatusChange = (newStatus: ExamSessionStatus | '') => {
    const newParams = new URLSearchParams(searchParams)
    if (newStatus) {
      newParams.set('status', newStatus)
    } else {
      newParams.delete('status')
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
    <AppLayout mainClassName="min-h-screen bg-surface pb-24 pt-20 px-4 sm:px-6 lg:px-8">
      <PageHelmet
        title={JLPT_EXAM_COPY.historyTitle}
        description={JLPT_EXAM_COPY.historyDescription}
      />

      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-primary">{JLPT_EXAM_COPY.historyTitle}</h1>
          <p className="mt-1 text-secondary">{JLPT_EXAM_COPY.historyDescription}</p>
        </header>

        <div className="mb-6">
          <Select
            value={status || 'all'}
            onValueChange={(value) =>
              handleStatusChange(value === 'all' ? '' : (value as ExamSessionStatus))
            }
          >
            <SelectTrigger className="h-9 w-auto min-w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {historyQuery.isLoading ? (
          <HistorySkeleton />
        ) : items.length === 0 ? (
          <EmptyHistoryState />
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <HistoryCard key={item.sessionId} item={item} />
              ))}
            </div>

            {totalPage > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
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
