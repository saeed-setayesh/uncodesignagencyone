import Image from 'next/image'
import { BRAND_MARK_SRC } from '@/lib/brand-assets'

const sizeStyles = {
  sm: { box: 'h-8 w-8', px: 32 },
  md: { box: 'h-9 w-9', px: 36 },
  lg: { box: 'h-12 w-12', px: 48 },
} as const

type BrandMarkSize = keyof typeof sizeStyles

export function BrandMark({ size = 'md' }: { size?: BrandMarkSize }) {
  const s = sizeStyles[size]
  return (
    <Image
      src={BRAND_MARK_SRC}
      alt=""
      width={s.px}
      height={s.px}
      className={`shrink-0 rounded-lg object-contain ${s.box}`}
      priority
    />
  )
}
