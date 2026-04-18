import { GearSixIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'

/**
 * Tiến trình học card — placeholder for SRS data (chưa có backend).
 * Reusable for all card types (Vocabulary, Grammar, Kanji).
 */
export function CardProgress() {
  return (
    <Card className="py-0 feature-card">
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="section-title-text">
            {VOCAB_DETAIL_COPY.progress.title}
          </span>
          <GearSixIcon size={16} className="text-foreground/70" />
        </div>

        {/* Coming soon placeholder */}
        <div className="flex flex-col items-center justify-center gap-2 py-4 opacity-60">
          <Badge variant="default" className="bg-amber-500 text-white border-none">
            {VOCAB_DETAIL_COPY.progress.comingSoon}
          </Badge>
          <div className="flex gap-6 text-center mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="section-meta-text">{VOCAB_DETAIL_COPY.progress.nextReview}</span>
              <span className="section-label-text">—</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="section-meta-text">{VOCAB_DETAIL_COPY.progress.firstLearned}</span>
              <span className="section-label-text">—</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="section-meta-text">{VOCAB_DETAIL_COPY.progress.reviewCount}</span>
              <span className="section-label-text">—</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
