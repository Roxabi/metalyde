import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const emptyStateVariants = cva(
  'flex flex-col items-center gap-3 py-12 text-center max-w-md mx-auto',
  {
    variants: {
      variant: {
        default:
          'rounded-lg border border-dashed p-8 [&>[data-slot=empty-state-icon]]:text-muted-foreground/50',
        error:
          'rounded-lg border border-destructive/50 p-8 [&>[data-slot=empty-state-icon]]:text-destructive',
        search: '[&>[data-slot=empty-state-icon]]:text-muted-foreground/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type EmptyStateProps = React.ComponentProps<'div'> &
  VariantProps<typeof emptyStateVariants> & {
    icon: React.ReactNode
    title?: string
    description: string
    hint?: string
    action?: React.ReactNode
  }

function EmptyState({
  icon,
  title,
  description,
  hint,
  action,
  variant = 'default',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      data-variant={variant}
      className={cn(emptyStateVariants({ variant }), className)}
      {...props}
    >
      <div data-slot="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <p className="text-sm text-muted-foreground">{description}</p>
      {hint && (
        <p data-slot="empty-state-hint" className="text-xs text-muted-foreground/70">
          {hint}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export { EmptyState, emptyStateVariants }
