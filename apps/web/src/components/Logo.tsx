import { cn } from '@repo/ui'
import { clientEnv } from '@/lib/env.shared'

type LogoProps = {
  size?: 'sm' | 'default' | 'lg'
  showText?: boolean
}

const appName = clientEnv.VITE_APP_NAME ?? 'Metalyde'

const sizes = { sm: 'size-6', default: 'size-8', lg: 'size-10' } as const
const textSizes = { sm: 'text-lg', default: 'text-xl', lg: 'text-2xl' } as const

/**
 * Barcode-M square mark — Swiss Control Room brand.
 * Outer frame + vertical bars use currentColor (inherits text color).
 * Centre accent block is brand red-orange (#e63000).
 */
export function Logo({ size = 'default', showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 32 32"
        className={cn(sizes[size], 'text-foreground')}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer square frame */}
        <rect
          x="0.5"
          y="0.5"
          width="31"
          height="31"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.4"
        />
        {/* Left full-height bar */}
        <rect x="5" y="5" width="4.5" height="22" fill="currentColor" />
        {/* Right full-height bar */}
        <rect x="22.5" y="5" width="4.5" height="22" fill="currentColor" />
        {/* Left mid bar (top half) */}
        <rect x="9.5" y="5" width="4" height="13" fill="currentColor" />
        {/* Right mid bar (top half) */}
        <rect x="18.5" y="5" width="4" height="13" fill="currentColor" />
        {/* Centre brand-red accent block — follows the theme (brightens in dark) */}
        <rect x="13.5" y="14" width="5" height="4" fill="var(--brand)" />
      </svg>
      {showText && (
        <span className={cn('font-bold tracking-tight', textSizes[size])}>{appName}</span>
      )}
    </div>
  )
}
