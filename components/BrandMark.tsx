const sizeStyles = {
  sm: 'h-8 w-8 text-lg rounded-lg',
  md: 'h-9 w-9 text-2xl rounded-lg',
  lg: 'h-12 w-12 text-3xl rounded-xl',
} as const

type BrandMarkSize = keyof typeof sizeStyles

export function BrandMark({ size = 'md' }: { size?: BrandMarkSize }) {
  return (
    <div
      className={`shrink-0 bg-brand font-bold leading-none text-white flex items-center justify-center ${sizeStyles[size]}`}
    >
      U
    </div>
  )
}
