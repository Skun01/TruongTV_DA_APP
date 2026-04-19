import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { SEARCH_COPY } from '@/constants/search'

interface SearchHeaderProps {
  query: string
  onQueryChange: (value: string) => void
  onSubmit: () => void
}

export function SearchHeader({
  query,
  onQueryChange,
  onSubmit,
}: SearchHeaderProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-full border border-border/70 bg-card px-5 py-3 shadow-[0_2px_12px_0_rgba(29,28,19,0.08)] dark:bg-surface-container-high dark:shadow-[0_8px_22px_0_rgba(0,0,0,0.28)]"
    >
      <MagnifyingGlassIcon
        size={16}
        className="shrink-0 text-muted-foreground"
      />
      <input
        autoFocus
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder={SEARCH_COPY.inputPlaceholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  )
}
