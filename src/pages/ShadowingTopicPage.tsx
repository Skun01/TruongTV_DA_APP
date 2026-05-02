import { useEffect } from 'react'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CircleIcon,
  CrownIcon,
  HeadphonesIcon,
  MicrophoneIcon,
  PlayIcon,
  SpeakerSlashIcon,
} from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SHADOWING_COPY } from '@/constants/shadowing'
import {
  useShadowingTopic,
  useShadowingTopicProgress,
  useShadowingTopicResume,
  useShadowingTopicSentenceProgress,
} from '@/hooks/useShadowing'
import type { ShadowingTopicSentenceProgressItemResponse } from '@/types/shadowing'

function SentenceProgressItem({
  sentence,
  onClick,
}: {
  sentence: ShadowingTopicSentenceProgressItemResponse
  onClick: () => void
}) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 bg-surface-container-low transition-all hover:border-primary/30"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {sentence.hasAttempted ? (
              <CheckCircleIcon size={20} weight="fill" className="text-green-500" />
            ) : (
              <CircleIcon size={20} className="text-tertiary" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-primary">{sentence.text}</p>
                <p className="mt-1 text-sm text-secondary">{sentence.meaning}</p>
              </div>

              {!sentence.audioUrl && (
                <Badge variant="outline" className="gap-1 text-xs text-secondary">
                  <SpeakerSlashIcon size={14} />
                  {SHADOWING_COPY.noAudioBadge}
                </Badge>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {sentence.level && (
                <Badge variant="secondary" className="text-xs">
                  {sentence.level}
                </Badge>
              )}
              {sentence.hasAttempted && sentence.latestPronScore !== null && (
                <span className="text-xs text-secondary">
                  {SHADOWING_COPY.sentenceScoreLabel}: {Math.round(sentence.latestPronScore)}/100
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TopicSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <Skeleton className="mb-4 h-8 w-48" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="border-border/50 bg-surface-container-low">
              <CardContent className="flex gap-4 p-4">
                <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ShadowingTopicPage() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()

  const topicQuery = useShadowingTopic(topicId ?? '')
  const progressQuery = useShadowingTopicProgress(topicId ?? '')
  const sentenceProgressQuery = useShadowingTopicSentenceProgress(topicId ?? '')
  const resumeQuery = useShadowingTopicResume(topicId ?? '')

  const topic = topicQuery.data
  const progress = progressQuery.data
  const sentences = sentenceProgressQuery.data ?? []
  const resume = resumeQuery.data

  useEffect(() => {
    if (topicQuery.isFetching || progressQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [topicQuery.isFetching, progressQuery.isFetching])

  const handleStartPractice = (sentenceId?: string) => {
    if (!topicId) {
      return
    }

    if (sentenceId) {
      navigate(`/shadowing/topics/${topicId}/practice?sentenceId=${sentenceId}`)
      return
    }

    if (resume?.recommendedSentenceId) {
      navigate(`/shadowing/topics/${topicId}/practice?sentenceId=${resume.recommendedSentenceId}`)
      return
    }

    if (sentences.length > 0) {
      navigate(`/shadowing/topics/${topicId}/practice?sentenceId=${sentences[0].sentenceId}`)
    }
  }

  const progressPercent =
    topic && progress ? Math.round((progress.attemptedSentencesCount / topic.sentencesCount) * 100) : 0

  if (topicQuery.isLoading) {
    return (
      <AppLayout mainClassName="min-h-screen bg-surface px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <TopicSkeleton />
      </AppLayout>
    )
  }

  if (!topic) {
    return (
      <AppLayout
        mainClassName="min-h-screen pt-24 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 lg:px-8">
          <p className="text-secondary">{SHADOWING_COPY.loadTopicError}</p>
          <Button onClick={() => navigate('/shadowing')}>
            <ArrowLeftIcon size={16} className="mr-2" />
            {SHADOWING_COPY.backToTopics}
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      mainClassName="min-h-screen pt-24 pb-16"
      mainStyle={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:px-8">
        <PageHelmet title={topic.title} description={topic.description} />

        <Button
          variant="ghost"
          size="sm"
          className="w-fit rounded-full text-secondary"
          onClick={() => navigate('/shadowing')}
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          {SHADOWING_COPY.backToTopics}
        </Button>

        <header className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{topic.title}</h1>
                {topic.isOfficial && <CrownIcon size={20} weight="fill" className="text-amber-500" />}
              </div>
              <p className="mt-1 text-secondary">{topic.description}</p>
            </div>

            {topic.coverImageUrl && (
              <img
                src={topic.coverImageUrl}
                alt={topic.title}
                className="hidden h-24 w-24 rounded-xl object-cover sm:block"
              />
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {topic.level && <Badge variant="secondary" className="text-xs">{topic.level}</Badge>}
            <Badge variant="outline">
              {topic.sentencesCount} {SHADOWING_COPY.sentencesCount}
            </Badge>
          </div>
        </header>

        <Card className="mb-6 border-border/50 bg-surface-container-low">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <HeadphonesIcon size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-primary">{SHADOWING_COPY.progressSummary}</p>
                  <p className="text-sm text-secondary">
                    {progress?.attemptedSentencesCount ?? 0}/{topic.sentencesCount} {SHADOWING_COPY.completedSentences}
                  </p>
                </div>
              </div>

              <Button onClick={() => handleStartPractice()} disabled={sentences.length === 0}>
                <PlayIcon size={16} className="mr-2" />
                {resume?.lastAttemptSentenceId ? SHADOWING_COPY.resumePractice : SHADOWING_COPY.startFromBeginning}
              </Button>
            </div>
            <Progress value={progressPercent} className="mt-4" />
          </CardContent>
        </Card>

        <Tabs defaultValue="sentences" className="gap-4">
          <TabsList variant="line" className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger value="sentences" className="rounded-none px-4 py-2">
              {SHADOWING_COPY.sentencesList}
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-none px-4 py-2">
              {SHADOWING_COPY.progressSummary}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sentences" className="space-y-4">
            <p className="text-sm text-secondary">{SHADOWING_COPY.topicSentenceListHint}</p>

            {sentences.length === 0 ? (
              <div className="py-12 text-center">
                <MicrophoneIcon size={48} className="mx-auto text-tertiary" />
                <p className="mt-4 text-secondary">{SHADOWING_COPY.emptySentences}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentences.map((sentence) => (
                  <SentenceProgressItem
                    key={sentence.sentenceId}
                    sentence={sentence}
                    onClick={() => handleStartPractice(sentence.sentenceId)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress">
            <Card className="border-border/50 bg-surface-container-low">
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-secondary">{SHADOWING_COPY.completedSentences}</p>
                    <p className="text-2xl font-bold text-primary">
                      {progress?.attemptedSentencesCount ?? 0}/{topic.sentencesCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">{SHADOWING_COPY.bestScore}</p>
                    <p className="text-2xl font-bold text-primary">
                      {progress?.bestPronScore !== null && progress?.bestPronScore !== undefined
                        ? `${Math.round(progress.bestPronScore)}/100`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">{SHADOWING_COPY.latestScore}</p>
                    <p className="text-2xl font-bold text-primary">
                      {progress?.latestPronScore !== null && progress?.latestPronScore !== undefined
                        ? `${Math.round(progress.latestPronScore)}/100`
                        : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
