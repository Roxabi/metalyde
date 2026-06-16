import { cn } from '@/lib/utils'

import { Skeleton } from './Skeleton'

interface SkeletonTableProps extends React.ComponentProps<'div'> {
  rows?: number
  cols?: number
}

function SkeletonTable({ rows = 5, cols = 4, className, ...props }: SkeletonTableProps) {
  return (
    <div
      data-slot="skeleton-table"
      className={cn('w-full overflow-hidden rounded-md border', className)}
      {...props}
    >
      {/* Header row */}
      <div className="flex gap-3 border-b bg-muted/40 px-4 py-2">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, no identity
            key={colIndex}
            className={cn('h-3', colIndex === 0 ? 'w-1/4' : 'flex-1')}
          />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, no identity
          key={rowIndex}
          className="flex gap-3 border-b px-4 py-3 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols, no identity
              key={colIndex}
              className={cn('h-3', colIndex === 0 ? 'w-1/4' : 'flex-1')}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { SkeletonTable }
export type { SkeletonTableProps }
