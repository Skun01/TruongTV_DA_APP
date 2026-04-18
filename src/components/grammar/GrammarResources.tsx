import { LinkSimpleIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { GRAMMAR_DETAIL_COPY } from '@/constants/grammarDetail'
import type { GrammarResourceItem } from '@/types/grammar'

interface GrammarResourcesProps {
  resources: GrammarResourceItem[]
}

export function GrammarResources({ resources }: GrammarResourcesProps) {
  return (
    <section className="flex flex-col gap-4">
      <span className="section-title-text">{GRAMMAR_DETAIL_COPY.sections.resources}</span>

      {resources.length === 0 ? (
        <Card className="py-0 feature-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{GRAMMAR_DETAIL_COPY.empty.noResources}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map((resource) => (
            <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
              <Card className="py-0 feature-card hover:feature-card-hover transition-all duration-300">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-foreground">{resource.title}</span>
                  <LinkSimpleIcon size={16} className="text-muted-foreground" />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
