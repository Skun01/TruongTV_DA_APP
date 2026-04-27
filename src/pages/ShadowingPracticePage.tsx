import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  MicrophoneIcon,
  PlayCircleIcon,
  SpeakerHighIcon,
  SpinnerGap,
  StopIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import NProgress from 'nprogress'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { AssessmentResult } from '@/components/shadowing/AssessmentResult'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SHADOWING_COPY } from '@/constants/shadowing'
import { SHADOWING_ERROR_MESSAGES } from '@/constants/errors'
import { getApiErrorMessage } from '@/lib/apiError'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { useRecorder } from '@/hooks/useRecorder'
import {
  useShadowingTopic,
  useShadowingTopicSentenceProgress,
  useSubmitShadowingAttempt,
} from '@/hooks/useShadowing'
import type { ShadowingAttemptResponse } from '@/types/shadowing'

function PracticeSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="mb-4 h-8 w-32" />
      <Card className="border-border/50 bg-surface-container-low">
        <CardContent className="space-y-8 p-6 sm:p-8">
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-16" />
            <Skeleton className="mx-auto h-2 w-full" />
          </div>
          <div className="space-y-4 text-center">
            <Skeleton className="mx-auto h-32 w-full rounded-3xl" />
            <Skeleton className="mx-auto h-6 w-2/3" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ShadowingPracticePage() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()
  const [searchParams] = useSearchParams()
  const sentenceId = searchParams.get('sentenceId')

  const [attemptResult, setAttemptResult] = useState<ShadowingAttemptResponse | null>(null)
  const [isPreparingAudio, setIsPreparingAudio] = useState(false)

  const submitAttemptMutation = useSubmitShadowingAttempt()
  const { playAudio, playingAudioUrl } = useAudioPlayer({
    playErrorMessage: SHADOWING_COPY.audioPlaybackError,
  })

  const {
    isRecording,
    recordedAudio,
    recordedAudioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    convertToWav,
  } = useRecorder()

  const topicQuery = useShadowingTopic(topicId ?? '')
  const sentencesQuery = useShadowingTopicSentenceProgress(topicId ?? '')

  const topic = topicQuery.data
  const sentences = sentencesQuery.data ?? []
  const currentSentence = sentences.find((sentence) => sentence.sentenceId === sentenceId)
  const currentIndex = sentences.findIndex((sentence) => sentence.sentenceId === sentenceId)
  const nextSentence = currentIndex >= 0 ? sentences[currentIndex + 1] : undefined
  const progressValue = sentences.length > 0 ? ((currentIndex + 1) / sentences.length) * 100 : 0
  const isSampleAudioAvailable = Boolean(currentSentence?.audioUrl)
  const isSampleAudioPlaying = Boolean(currentSentence?.audioUrl && playingAudioUrl === currentSentence.audioUrl)

  useEffect(() => {
    if (topicQuery.isFetching || sentencesQuery.isFetching) {
      NProgress.start()
      return
    }
    NProgress.done()
  }, [topicQuery.isFetching, sentencesQuery.isFetching])

  useEffect(() => {
    if (topicQuery.isError) {
      gooeyToast.error(
        getApiErrorMessage(topicQuery.error, SHADOWING_ERROR_MESSAGES.default_shadowing),
      )
    }
  }, [topicQuery.isError, topicQuery.error])

  useEffect(() => {
    if (sentencesQuery.isError) {
      gooeyToast.error(
        getApiErrorMessage(sentencesQuery.error, SHADOWING_ERROR_MESSAGES.default_shadowing),
      )
    }
  }, [sentencesQuery.isError, sentencesQuery.error])

  const handleRecordAction = async () => {
    if (isRecording) {
      stopRecording()
      return
    }

    setAttemptResult(null)
    await startRecording()
  }

  const handlePlaySampleAudio = async () => {
    await playAudio(currentSentence?.audioUrl)
  }

  const handleReplayRecordedAudio = () => {
    if (!recordedAudioUrl) {
      return
    }

    const audio = new Audio(recordedAudioUrl)
    void audio.play()
  }

  const handleSubmitRecording = async () => {
    if (!recordedAudio || !topicId || !sentenceId) {
      return
    }

    setIsPreparingAudio(true)

    try {
      const wavFile = await convertToWav()
      if (!wavFile) {
        setIsPreparingAudio(false)
        gooeyToast.error(SHADOWING_COPY.recordingUnavailable)
        return
      }

      submitAttemptMutation.mutate(
        {
          topicId,
          sentenceId,
          audio: wavFile,
        },
        {
          onSuccess: (result) => {
            setAttemptResult(result)
          },
          onSettled: () => {
            setIsPreparingAudio(false)
          },
        },
      )
    } catch {
      setIsPreparingAudio(false)
      gooeyToast.error(SHADOWING_COPY.recordingUnavailable)
    }
  }

  const handleNextSentence = () => {
    if (!nextSentence) {
      navigate(`/shadowing/topics/${topicId}`)
      return
    }

    navigate(`/shadowing/topics/${topicId}/practice?sentenceId=${nextSentence.sentenceId}`)
    resetRecording()
    setAttemptResult(null)
    setIsPreparingAudio(false)
  }

  if (topicQuery.isLoading || sentencesQuery.isLoading) {
    return (
      <AppLayout mainClassName="min-h-screen bg-surface px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <PracticeSkeleton />
      </AppLayout>
    )
  }

  if (!topic || !currentSentence) {
    return (
      <AppLayout mainClassName="min-h-screen bg-surface px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-secondary">{SHADOWING_COPY.loadTopicError}</p>
          <Button className="mt-4" onClick={() => navigate(`/shadowing/topics/${topicId}`)}>
            <ArrowLeftIcon size={16} className="mr-2" />
            {SHADOWING_COPY.backToTopic}
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout mainClassName="min-h-screen bg-surface px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      <PageHelmet title={`${SHADOWING_COPY.practiceTitle} - ${topic.title}`} />

      <div className="mx-auto max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-secondary"
          onClick={() => navigate(`/shadowing/topics/${topicId}`)}
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          {SHADOWING_COPY.backToTopic}
        </Button>

        <Card className="border-border/50 bg-surface-container-low">
          <CardContent className="space-y-8 p-6 sm:p-8">
            <div className="space-y-2 text-center">
              <p className="text-sm text-secondary">
                {currentIndex + 1} / {sentences.length}
              </p>
              <Progress value={progressValue} />
            </div>

            {!isSampleAudioAvailable && (
              <Alert variant="destructive">
                <WarningCircleIcon size={20} />
                <AlertTitle>{SHADOWING_COPY.sampleAudioMissingTitle}</AlertTitle>
                <AlertDescription>{SHADOWING_COPY.sampleAudioMissingDescription}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 text-center">
              <div
                className={`rounded-3xl bg-background px-6 py-12 shadow-sm transition-all duration-200 ${
                  isRecording ? 'blur-md opacity-40 select-none' : ''
                }`}
              >
                <p className="text-3xl font-bold leading-relaxed text-primary sm:text-4xl">
                  {currentSentence.text}
                </p>
              </div>
              {currentSentence.meaning && !isRecording && (
                <p className="text-lg text-secondary">{currentSentence.meaning}</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-lg"
                    variant="outline"
                    onClick={() => void handlePlaySampleAudio()}
                    disabled={!isSampleAudioAvailable}
                    aria-label={isSampleAudioPlaying ? SHADOWING_COPY.pauseAudio : SHADOWING_COPY.playAudio}
                  >
                    <SpeakerHighIcon size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isSampleAudioPlaying ? SHADOWING_COPY.pauseAudio : SHADOWING_COPY.playAudio}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-lg"
                    variant={isRecording ? 'destructive' : 'default'}
                    onClick={() => void handleRecordAction()}
                    disabled={!isSampleAudioAvailable || submitAttemptMutation.isPending || isPreparingAudio}
                    aria-label={isRecording ? SHADOWING_COPY.stopRecording : SHADOWING_COPY.startRecording}
                  >
                    {isRecording ? <StopIcon size={24} /> : <MicrophoneIcon size={24} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRecording ? SHADOWING_COPY.stopRecording : SHADOWING_COPY.startRecording}
                </TooltipContent>
              </Tooltip>

              {recordedAudioUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-lg"
                      variant="outline"
                      onClick={handleReplayRecordedAudio}
                      aria-label={SHADOWING_COPY.listenToRecording}
                    >
                      <PlayCircleIcon size={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{SHADOWING_COPY.listenToRecording}</TooltipContent>
                </Tooltip>
              )}
            </div>

            {(isRecording || recordedAudio || submitAttemptMutation.isPending || isPreparingAudio) && (
              <div className="flex items-center justify-center gap-2 text-sm text-secondary">
                {(submitAttemptMutation.isPending || isPreparingAudio) ? <SpinnerGap size={18} className="animate-spin" /> : null}
                <span>
                  {isRecording
                    ? SHADOWING_COPY.recordingStatusActive
                    : submitAttemptMutation.isPending || isPreparingAudio
                      ? SHADOWING_COPY.submittingRecording
                      : SHADOWING_COPY.recordingStatusCompleted}
                </span>
              </div>
            )}

            {recordedAudioUrl && !attemptResult && (
              <div className="flex justify-center">
                <Button onClick={() => void handleSubmitRecording()} disabled={submitAttemptMutation.isPending || isPreparingAudio}>
                  {(submitAttemptMutation.isPending || isPreparingAudio) ? <SpinnerGap size={18} className="mr-2 animate-spin" /> : null}
                  {SHADOWING_COPY.submitRecording}
                </Button>
              </div>
            )}

            {attemptResult && (
              <AssessmentResult
                attemptResult={attemptResult}
                hasNextSentence={Boolean(nextSentence)}
                onRetry={() => {
                  resetRecording()
                  setAttemptResult(null)
                  setIsPreparingAudio(false)
                }}
                onNext={handleNextSentence}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
