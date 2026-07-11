import type { SocialMediaLink, SocialMediaPlatform } from '@/lib/social-media'

type Variant = 'footer' | 'contact'

type Props = {
  links: SocialMediaLink[]
  variant?: Variant
  className?: string
}

function PlatformIcon({ platform, className }: { platform: SocialMediaPlatform; className?: string }) {
  const cn = className ?? 'w-5 h-5'

  switch (platform) {
    case 'instagram':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'aparat':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'telegram_channel':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
  }
}

const PLATFORM_STYLE: Record<SocialMediaPlatform, { bg: string; hover: string }> = {
  instagram: { bg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]', hover: 'hover:opacity-90' },
  youtube: { bg: 'bg-[#FF0000]', hover: 'hover:opacity-90' },
  aparat: { bg: 'bg-[#ED145B]', hover: 'hover:opacity-90' },
  linkedin: { bg: 'bg-[#0A66C2]', hover: 'hover:opacity-90' },
  telegram_channel: { bg: 'bg-[#229ED9]', hover: 'hover:opacity-90' },
}

export default function SocialMediaLinks({ links, variant = 'footer', className = '' }: Props) {
  if (links.length === 0) return null

  if (variant === 'contact') {
    return (
      <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
        {links.map((link) => {
          const style = PLATFORM_STYLE[link.platform]
          return (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              aria-label={link.label}
              className={`inline-flex flex-col items-center gap-2 group`}
            >
              <span
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-md transition ${style.bg} ${style.hover}`}
              >
                <PlatformIcon platform={link.platform} className="w-7 h-7" />
              </span>
              <span className="text-xs font-medium text-gray-600 group-hover:text-brand transition-colors">
                {link.label}
              </span>
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className={className}>
      <p className="text-white font-semibold text-sm mb-3">شبکه‌های اجتماعی</p>
      <div className="flex flex-wrap gap-2.5">
        {links.map((link) => {
          const style = PLATFORM_STYLE[link.platform]
          return (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              aria-label={link.label}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-white transition ${style.bg} ${style.hover}`}
            >
              <PlatformIcon platform={link.platform} />
            </a>
          )
        })}
      </div>
    </div>
  )
}
