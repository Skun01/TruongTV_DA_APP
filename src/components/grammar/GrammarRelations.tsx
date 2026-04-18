import { ArrowSquareOutIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GRAMMAR_DETAIL_COPY } from '@/constants/grammarDetail'
import type { GrammarRelationItem } from '@/types/grammar'

interface GrammarRelationsProps {
  relations: GrammarRelationItem[]
}

export function GrammarRelations({ relations }: GrammarRelationsProps) {
  return (
    <section className="flex flex-col gap-4">
      <span className="section-title-text">{GRAMMAR_DETAIL_COPY.sections.related}</span>

      {relations.length === 0 ? (
        <Card className="py-0 feature-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{GRAMMAR_DETAIL_COPY.empty.noRelations}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {relations.map((relation) => {
            const fallbackTitle = `${GRAMMAR_DETAIL_COPY.related.fallbackTitle} ${relation.relatedId}`
            const title = relation.title?.trim() || fallbackTitle
            const summary = relation.summary?.trim()

            return (
              <a
                key={`${relation.relatedId}-${relation.relationType}`}
                href={`/grammar/${relation.relatedId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="py-0 feature-card hover:feature-card-hover transition-all duration-300">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {title}
                      </p>
                      {summary && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {summary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline">
                        {GRAMMAR_DETAIL_COPY.relationType[relation.relationType]}
                      </Badge>
                      <span className="sr-only">{GRAMMAR_DETAIL_COPY.related.openNewTabLabel}</span>
                      <ArrowSquareOutIcon size={14} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
