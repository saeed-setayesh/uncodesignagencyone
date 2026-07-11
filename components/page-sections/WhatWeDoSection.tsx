import type { LucideIcon } from 'lucide-react'
import NextLink from 'next/link'
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Bug,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  Cloud,
  Code2,
  CreditCard,
  FileSearch,
  FileText,
  Gauge,
  GitBranch,
  GraduationCap,
  HardDrive,
  Hash,
  Headphones,
  Image,
  KeyRound,
  LayoutTemplate,
  LineChart,
  Link2,
  MessageCircle,
  MessageSquare,
  Newspaper,
  Package,
  Palette,
  PenLine,
  Plug,
  Search,
  Server,
  Shield,
  ShoppingCart,
  Smartphone,
  SpellCheck,
  Target,
  TrendingUp,
  Truck,
  Upload,
  UserPlus,
  Wrench,
  Zap,
} from 'lucide-react'
import type { ServiceDeliverables } from '@/types/service-deliverables'

const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardList: FileText,
  Palette,
  Code2,
  Search,
  Server,
  GraduationCap,
  Gauge,
  KeyRound,
  FileSearch,
  PenLine,
  Link2,
  BarChart3,
  BookOpen,
  Calendar,
  Newspaper,
  LayoutTemplate,
  Clapperboard,
  SpellCheck: PenLine,
  Target,
  CalendarDays: Calendar,
  Image,
  Hash,
  MessageCircle,
  TrendingUp,
  GitBranch,
  Plug,
  Bot,
  UserPlus,
  LineChart,
  Cloud,
  Activity,
  HardDrive,
  Shield,
  Wrench,
  Zap,
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  Smartphone,
  Bug,
  Upload,
  MessageSquare,
  CheckCircle2,
  Headphones,
}

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? CheckCircle2
}

type Props = {
  serviceFa: string
  deliverables: ServiceDeliverables
}

export default function WhatWeDoSection({ serviceFa, deliverables }: Props) {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-100" aria-label="خدمات اجرایی">
      <div className="max-w-6xl mx-auto px-4" dir="rtl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            ما دقیقاً برای {serviceFa} چه می‌کنیم؟
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">{deliverables.summary}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
          {deliverables.whatWeDo.map((item) => {
            const Icon = resolveIcon(item.icon)
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 hover:border-brand/30 hover:shadow-md transition"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand mb-3">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-500 mb-3 text-center">ابزار و فناوری</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {deliverables.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {deliverables.outcomes.map((o) => (
            <div
              key={o.metric + o.description}
              className="rounded-2xl bg-gradient-to-br from-brand-light/80 to-white border border-brand/15 p-5 text-center"
            >
              <div className="text-2xl md:text-3xl font-black text-brand mb-1">{o.metric}</div>
              <p className="text-xs md:text-sm text-gray-600">{o.description}</p>
            </div>
          ))}
        </div>

        {deliverables.notIncluded && deliverables.notIncluded.length > 0 && (
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-5 mb-8">
            <h3 className="text-sm font-bold text-amber-900 mb-2">خارج از این بسته (شفاف‌سازی)</h3>
            <ul className="text-sm text-amber-900/90 space-y-1 list-disc list-inside">
              {deliverables.notIncluded.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-center">
          <NextLink
            href="/price-calculator"
            className="inline-flex items-center justify-center text-brand font-semibold text-sm hover:underline"
          >
            برآورد تخمینی قیمت — ماشین‌حساب آنلاین ←
          </NextLink>
        </p>
      </div>
    </section>
  )
}
