import { useState } from 'react'
import { SpeakerHighIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import type { SentenceItem } from '@/types/vocabulary'

interface CardExamplesProps {
  sentences: SentenceItem[]
}

/**
 * VÍ DỤ section — reusable cho cả Vocabulary và Grammar cards.
 *
 * - Toggle "Hiện/Ẩn nghĩa" toàn bộ.
 * - Khi ẩn: nghĩa bị blur (css filter), hover vào card đó thì nghĩa hiện lại.
 */
export function CardExamples({ sentences }: CardExamplesProps) {
  const [showMeanings, setShowMeanings] = useState(true)
  const { playAudio, playingAudioUrl } = useAudioPlayer({
    playErrorMessage: VOCAB_DETAIL_COPY.audio.playError,
  })

  if (sentences.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      {/* Section header with toggle */}
      <div className="flex items-center justify-between">
        <span className="section-title-text">
          {VOCAB_DETAIL_COPY.examples.title}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 section-label-text"
          onClick={() => setShowMeanings((prev) => !prev)}
        >
          {showMeanings ? (
            <EyeSlashIcon size={14} weight="bold" />
          ) : (
            <EyeIcon size={14} weight="bold" />
          )}
          {showMeanings
            ? VOCAB_DETAIL_COPY.examples.hideMeaning
            : VOCAB_DETAIL_COPY.examples.showMeaning}
        </Button>
      </div>

      {/* Sentence cards */}
      <div className="flex flex-col gap-3">
        {sentences.map((sentence) => (
          <ExampleCard
            key={sentence.id}
            sentence={sentence}
            isMeaningVisible={showMeanings}
            playingAudioUrl={playingAudioUrl}
            onPlayAudio={playAudio}
          />
        ))}
      </div>
    </section>
  )
}

// ─── Single example card ────────────────────────────────────────────────────

function ExampleCard({
  sentence,
  isMeaningVisible,
  playingAudioUrl,
  onPlayAudio,
}: {
  sentence: SentenceItem
  isMeaningVisible: boolean
  playingAudioUrl: string | null
  onPlayAudio: (audioUrl?: string | null) => Promise<void>
}) {
  const resolvedAudioUrl = resolveMediaUrl(sentence.audioUrl)
  const isAudioAvailable = Boolean(resolvedAudioUrl)
  const isPlaying = Boolean(resolvedAudioUrl && playingAudioUrl === resolvedAudioUrl)

  return (
    <Card
      className="group py-0 feature-card"
    >
      <CardContent className="p-4 flex items-start justify-between gap-4">
        {/* Left: text + meaning */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p
            className="font-heading-jp text-lg text-foreground"
            style={{ lineHeight: 1.8 }}
          >
            {sentence.text}
          </p>

          {/* Meaning — always rendered, blur when hidden, hover to reveal */}
          <p
            className={`section-caption-text select-none transition-all duration-200 ${
              isMeaningVisible
                ? ''
                : 'blur-[6px] group-hover:blur-none'
            }`}
          >
            {sentence.meaning}
          </p>
        </div>

        {/* Right: level badge + audio */}
        <div className="flex items-center gap-2 shrink-0 mt-1">
          {sentence.level && (
            <Badge variant="outline" className="text-sm font-semibold">
              {sentence.level}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={[
              'h-8 w-8 rounded-full transition-colors',
              isPlaying ? 'bg-primary/10' : '',
            ].join(' ')}
            disabled={!isAudioAvailable}
            onClick={() => {
              void onPlayAudio(resolvedAudioUrl)
            }}
            title={isAudioAvailable ? VOCAB_DETAIL_COPY.audio.play : VOCAB_DETAIL_COPY.audio.unavailable}
          >
            <SpeakerHighIcon
              size={16}
              weight="fill"
              className={
                isAudioAvailable
                  ? 'text-primary'
                  : 'text-muted-foreground opacity-40'
              }
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
