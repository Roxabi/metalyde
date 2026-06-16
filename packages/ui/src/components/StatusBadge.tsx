import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * The 9 workflow statuses driven by the --status-* token family.
 * Add new statuses here only when the corresponding CSS tokens are also added.
 */
export type Status =
  | 'draft'
  | 'planned'
  | 'active'
  | 'review'
  | 'ontrack'
  | 'risk'
  | 'blocked'
  | 'done'
  | 'archived'

const STATUS_LABELS: Record<Status, string> = {
  draft: 'Draft',
  planned: 'Planned',
  active: 'Active',
  review: 'Review',
  ontrack: 'On Track',
  risk: 'At Risk',
  blocked: 'Blocked',
  done: 'Done',
  archived: 'Archived',
}

export interface StatusBadgeProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** The workflow status to display. Controls bg, fg and dot colours via CSS tokens. */
  status: Status
  /**
   * Override the default human-readable label derived from `status`.
   * Useful for localisation or custom copy.
   */
  label?: string
}

/**
 * StatusBadge — a pill with a 6 px dot indicator.
 *
 * Anatomy: [dot · label]
 * Layout: inline-flex, rounded-full, gap-1.5, px-2.5 py-0.5, text-xs/medium.
 * Colours: resolved from --status-{status}, --status-{status}-fg, --status-{status}-dot tokens.
 * Self-contained — no cross-package type imports.
 */
function StatusBadge({ status, label, className, style, ...props }: StatusBadgeProps) {
  const displayLabel = label ?? STATUS_LABELS[status]

  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0',
        className
      )}
      style={{
        backgroundColor: `var(--status-${status})`,
        color: `var(--status-${status}-fg)`,
        ...style,
      }}
      {...props}
    >
      {/* 6 px dot — uses the -dot sub-token for a more saturated indicator colour */}
      <span
        aria-hidden="true"
        className="shrink-0 rounded-full"
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: `var(--status-${status}-dot)`,
        }}
      />
      {displayLabel}
    </span>
  )
}

export { StatusBadge }
