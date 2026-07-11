import Image from 'next/image'
import { BRAND_LOGOTEXT_SRC } from '@/lib/brand-assets'
import { BrandMark } from '@/components/BrandMark'

const wordmarkHeights = {
  sm: { h: 16, w: 82 },
  md: { h: 20, w: 103 },
  lg: { h: 24, w: 124 },
} as const

type BrandLogoSize = keyof typeof wordmarkHeights

type Props = {
  size?: BrandLogoSize
  /** Show the English wordmark SVG beside the mark */
  showWordmark?: boolean
  className?: string
}

export function BrandLogo({ size = 'md', showWordmark = true, className = '' }: Props) {
  const wm = wordmarkHeights[size]

  return (
    <span className={`inline-flex items-center gap-2 shrink-0 min-w-0 ${className}`}>
      <BrandMark size={size} />
      {showWordmark ? (
        <Image
          src={BRAND_LOGOTEXT_SRC}
          alt="Uncodesign"
          width={wm.w}
          height={wm.h}
          className="h-auto w-auto max-h-[1.25rem] sm:max-h-[1.5rem] object-contain"
          priority
        />
      ) : null}
    </span>
  )
}
