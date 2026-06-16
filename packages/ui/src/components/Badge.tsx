import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/**
 * The 9 workflow status tones mapped to the --status-* token family.
 * When `tone` is set the CVA variant is bypassed and token-driven inline
 * styles are applied instead, keeping the variant API fully intact.
 */
export type StatusTone =
  | 'draft'
  | 'planned'
  | 'active'
  | 'review'
  | 'ontrack'
  | 'risk'
  | 'blocked'
  | 'done'
  | 'archived'

function Badge({
  className,
  variant,
  tone,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    /** When set, bypasses the CVA variant and applies --status-{tone} token colours. */
    tone?: StatusTone
  }) {
  const Comp = asChild ? Slot.Root : 'span'

  if (tone) {
    return (
      <Comp
        data-slot="badge"
        data-tone={tone}
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden',
          className
        )}
        style={{
          backgroundColor: `var(--status-${tone})`,
          color: `var(--status-${tone}-fg)`,
          ...style,
        }}
        {...props}
      />
    )
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      style={style}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
