import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { GRAMMAR_DETAIL_COPY } from '@/constants/grammarDetail'
import { toGrammarRichTextHtml } from '@/lib/grammarRichText'
import type { GrammarCardDetail, GrammarStructureItem } from '@/types/grammar'

interface GrammarDetailCardProps {
  card: GrammarCardDetail
}

function StructureBlock({ structure }: { structure: GrammarStructureItem }) {
  const annotations = structure.annotations ?? {}

  return (
    <div className="rounded-lg border border-border/70 p-3 flex flex-col gap-2">
      <p
        className="font-heading-jp text-base text-foreground"
        dangerouslySetInnerHTML={{ __html: toGrammarRichTextHtml(structure.pattern) }}
      />
      {Object.keys(annotations).length > 0 && (
        <div className="flex flex-col gap-1">
          {Object.entries(annotations).map(([key, value]) => (
            <p
              key={key}
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: `(${key}) ${toGrammarRichTextHtml(value)}` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function GrammarDetailCard({ card }: GrammarDetailCardProps) {
  return (
    <Card className="py-0 feature-card">
      <CardContent className="p-5 flex flex-col gap-5">
        <span className="section-title-text">{GRAMMAR_DETAIL_COPY.detail.title}</span>

        <div className="flex flex-col gap-3">
          <span className="section-label-text">{GRAMMAR_DETAIL_COPY.detail.structures}</span>
          {card.structures.map((structure, index) => (
            <StructureBlock key={`${structure.pattern}-${index}`} structure={structure} />
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="section-label-text">{GRAMMAR_DETAIL_COPY.detail.explanation}</span>
          <div
            className="text-sm text-foreground whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: toGrammarRichTextHtml(card.explanation) }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="section-label-text">{GRAMMAR_DETAIL_COPY.detail.caution}</span>
          {card.caution ? (
            <div
              className="text-sm text-muted-foreground whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: toGrammarRichTextHtml(card.caution) }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{GRAMMAR_DETAIL_COPY.empty.noCaution}</p>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <span className="section-label-text">{GRAMMAR_DETAIL_COPY.detail.register}</span>
            <Badge variant="outline" className="w-fit">
              {card.register
                ? GRAMMAR_DETAIL_COPY.registerLabel[card.register]
                : GRAMMAR_DETAIL_COPY.empty.noRegister}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="section-label-text">{GRAMMAR_DETAIL_COPY.detail.alternateForms}</span>
          {card.alternateForms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {card.alternateForms.map((form) => (
                <Badge key={form} variant="secondary">
                  {form}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{GRAMMAR_DETAIL_COPY.empty.noAlternateForms}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="section-label-text">{GRAMMAR_DETAIL_COPY.detail.tags}</span>
          {card.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{GRAMMAR_DETAIL_COPY.empty.noTags}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
