import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SEARCH_COPY } from '@/constants/search'
import type { SearchCardSummary } from '@/types/search'

interface SearchResultCardProps {
  card: SearchCardSummary
}

const CARD_TYPE_BADGE_CLASSES: Record<SearchCardSummary['cardType'], string> = {
  Vocab: 'bg-blue-100 text-blue-700',
  Grammar: 'bg-violet-100 text-violet-700',
  Kanji: 'bg-amber-100 text-amber-700',
}

export function SearchResultCard({ card }: SearchResultCardProps) {
  const href =
    card.cardType === 'Grammar'
      ? `/grammar/${card.id}`
      : card.cardType === 'Kanji'
        ? `/kanji/${card.id}`
        : `/vocabulary/${card.id}`
  const showAlternateForms = card.cardType === 'Grammar' && card.alternateForms.length > 0

  return (
    <Link to={href} className="block group">
      <Card className="rounded-3xl border border-border/70 bg-card py-0 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_16px_0_rgba(29,28,19,0.10)] dark:bg-surface-container-high dark:shadow-[0_8px_22px_0_rgba(0,0,0,0.24)] dark:group-hover:shadow-[0_10px_26px_0_rgba(0,0,0,0.32)]">
        <CardContent className="flex items-start justify-between gap-4 p-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-heading-jp text-xl text-foreground">
                {card.title}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {card.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-1 items-center">
              <Badge
                className={`border-transparent text-[10px] ${CARD_TYPE_BADGE_CLASSES[card.cardType]}`}
              >
                {SEARCH_COPY.cardTypePill[card.cardType]}
              </Badge>
              {showAlternateForms && (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {SEARCH_COPY.grammarAlternateForms}: {card.alternateForms.join(', ')}
                </span>
              )}
            </div>
          </div>

          {card.level && (
            <Badge variant="outline" className="shrink-0 font-semibold">
              {card.level}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
