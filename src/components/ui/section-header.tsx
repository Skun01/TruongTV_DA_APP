import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * SectionHeader — header cho section trong page: eyebrow + title + description + action.
 *  • Eyebrow (label nhỏ) tuỳ chọn dùng cho "episode label".
 *  • Title dùng Kiwi Maru cho display feel, hoặc Nunito bold (`variant="editorial" | "plain"`).
 */

interface SectionHeaderProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  align?: 'start' | 'center'
  variant?: 'editorial' | 'plain'
  className?: string
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'start',
  variant = 'editorial',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'text-center items-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-2',
          align === 'center' && 'items-center',
        )}
      >
        {eyebrow ? (
          <span className="text-[0.6875rem] font-heading-vn font-bold uppercase tracking-[0.14em] text-tertiary">
            {eyebrow}
          </span>
        ) : null}

        <h2
          className={cn(
            'text-foreground leading-tight tracking-[0.01em]',
            variant === 'editorial'
              ? 'font-heading-jp text-[clamp(1.5rem,2vw+0.5rem,2.25rem)] font-medium'
              : 'font-heading-vn text-[clamp(1.25rem,1.5vw+0.5rem,1.75rem)] font-bold',
          )}
        >
          {title}
        </h2>

        {description ? (
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export { SectionHeader }
