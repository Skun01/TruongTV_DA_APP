import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { KANJI_DETAIL_COPY } from '@/constants/kanjiDetail'
import { resolveBackendUrl } from '@/lib/mediaUrl'
import type { KanjiCardDetail, KanjiRadicalItem } from '@/types/kanji'

interface KanjiDetailCardProps {
  card: KanjiCardDetail
}

function RadicalChip({ radical }: { radical: KanjiRadicalItem }) {
  const isLinked = Boolean(radical.kanjiCardId)

  const chip = (
    <div
      className={[
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200',
        isLinked
          ? 'border-primary/30 hover:border-primary/50 cursor-pointer'
          : 'border-border/70 cursor-default',
      ].join(' ')}
      style={{
        backgroundColor: isLinked
          ? 'color-mix(in srgb, var(--primary) 5%, transparent)'
          : 'var(--surface-container-low)',
      }}
    >
      <span className="font-heading-jp text-lg text-foreground leading-none">
        {radical.character}
      </span>
      <span
        className="text-xs leading-tight"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {radical.meaningVi}
      </span>
    </div>
  )

  if (isLinked) {
    return (
      <Link to={`/kanji/${radical.kanjiCardId}`}>
        {chip}
      </Link>
    )
  }

  return chip
}

export function KanjiDetailCard({ card }: KanjiDetailCardProps) {
  return (
    <Card className="py-0 feature-card">
      <CardContent className="p-5 flex flex-col gap-6">

        {/* ── Kanji showcase + stroke order ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-4 items-start">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: 96,
                height: 96,
                backgroundColor: 'var(--surface-container-highest)',
              }}
            >
              <span className="font-heading-jp text-foreground select-all" style={{ fontSize: '3.5rem', lineHeight: 1 }}>
                {card.kanji}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <p className="text-base font-semibold text-foreground leading-snug">
                {card.meaningVi}
              </p>
              {card.hanViet && (
                <span
                  className="text-sm"
                  style={{ color: 'var(--on-surface-variant)' }}
                >
                  {KANJI_DETAIL_COPY.detail.hanViet}: <strong className="text-foreground">{card.hanViet}</strong>
                </span>
              )}
              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: 'var(--on-surface-variant)' }}
              >
                <span>{KANJI_DETAIL_COPY.detail.strokeCount}: <strong className="text-foreground">{card.strokeCount}</strong></span>
              </div>
            </div>
          </div>

          {card.strokeOrderUrl && (
            <div
              className="flex flex-col gap-2 rounded-xl p-3"
              style={{ backgroundColor: 'var(--surface-container-highest)' }}
            >
              <span className="section-label-text">{KANJI_DETAIL_COPY.detail.strokeOrder}</span>
              <img
                src={resolveBackendUrl(card.strokeOrderUrl)}
                alt={KANJI_DETAIL_COPY.strokeOrderAlt(card.kanji)}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* ── Readings ── */}
        <div className="flex flex-col gap-4">
          <span className="section-title-text">{KANJI_DETAIL_COPY.detail.title}</span>

          {/* On'yomi */}
          <div className="flex flex-col gap-2">
            <span className="section-label-text">{KANJI_DETAIL_COPY.detail.onyomi}</span>
            {card.onyomi.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.onyomi.map((reading) => (
                  <Badge
                    key={reading}
                    variant="outline"
                    className="font-heading-jp text-sm px-3 py-1"
                  >
                    {reading}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{KANJI_DETAIL_COPY.empty.noOnyomi}</p>
            )}
          </div>

          {/* Kun'yomi */}
          <div className="flex flex-col gap-2">
            <span className="section-label-text">{KANJI_DETAIL_COPY.detail.kunyomi}</span>
            {card.kunyomi.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.kunyomi.map((reading) => (
                  <Badge
                    key={reading}
                    variant="outline"
                    className="font-heading-jp text-sm px-3 py-1"
                  >
                    {reading}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{KANJI_DETAIL_COPY.empty.noKunyomi}</p>
            )}
          </div>

          {/* Han Viet (standalone, if not shown in header) */}
          {!card.hanViet && (
            <div className="flex flex-col gap-2">
              <span className="section-label-text">{KANJI_DETAIL_COPY.detail.hanViet}</span>
              <p className="text-sm text-muted-foreground">{KANJI_DETAIL_COPY.empty.noHanViet}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* ── Radicals (Bộ thủ) ── */}
        <div className="flex flex-col gap-3">
          <span className="section-label-text">{KANJI_DETAIL_COPY.detail.radicals}</span>
          {card.radicals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {card.radicals.map((radical) => (
                <RadicalChip key={radical.id} radical={radical} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{KANJI_DETAIL_COPY.empty.noRadicals}</p>
          )}
        </div>

        {/* ── Tags ── */}
        {card.tags.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <span className="section-label-text">{KANJI_DETAIL_COPY.detail.tags}</span>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
