import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Calligraphy Stamp — nhãn vuông nhỏ lấy cảm hứng từ con dấu thư pháp.
 *  • Luôn vuông (border-radius 0.25rem theo DESIGN.md).
 *  • Dùng cho label ngắn: JLPT level, category, "Official", "New".
 *  • Không dùng thay Badge (rounded-full) cho selection chips.
 */

const stampVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-[0.25rem] font-heading-vn text-[0.6875rem] font-bold uppercase tracking-[0.08em] leading-none transition-colors',
  {
    variants: {
      tone: {
        /** Mặc định — màu tertiary (nâu đỏ "dấu triện"). */
        tertiary:
          'bg-[color-mix(in_srgb,var(--tertiary)_12%,var(--surface-container-low))] text-tertiary',
        /** Indigo ink — authoritative / official. */
        ink:
          'bg-[color-mix(in_srgb,var(--primary)_12%,var(--surface-container-low))] text-primary',
        /** Secondary — mist / neutral label. */
        mist:
          'bg-secondary-container text-on-secondary-container',
        /** Outline — nhẹ nhất, dùng cho tag phụ. */
        outline:
          'border border-outline-variant text-on-surface-variant bg-transparent',
        /** Destructive — cảnh báo / sai. */
        danger:
          'bg-[color-mix(in_srgb,var(--destructive)_14%,var(--surface-container-low))] text-destructive',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[0.625rem]',
        md: 'px-2 py-1 text-[0.6875rem]',
        lg: 'px-2.5 py-1.5 text-[0.75rem]',
      },
    },
    defaultVariants: {
      tone: 'tertiary',
      size: 'md',
    },
  },
)

type CalligraphyStampProps = React.ComponentProps<'span'> &
  VariantProps<typeof stampVariants>

function CalligraphyStamp({
  className,
  tone,
  size,
  ...props
}: CalligraphyStampProps) {
  return (
    <span
      data-slot="calligraphy-stamp"
      className={cn(stampVariants({ tone, size }), className)}
      {...props}
    />
  )
}

export { CalligraphyStamp, stampVariants }
