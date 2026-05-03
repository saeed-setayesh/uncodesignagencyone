import type { Industry } from '@/lib/db'

/** برای بخش تعرفه روی صفحهٔ `/[service]` — غیر واقعی، فقط نمایش */
export const SERVICE_ROOT_PRICING_INDUSTRY = {
  id: '__service_root__',
  slug: '__service_root__',
  fa: 'کسب‌وکار ایرانی',
  desc: '',
  active: true,
  category: null,
  searchDemand: null,
  competition: null,
  suggestedCodes: null,
  suggestedServices: [] as string[],
  createdAt: new Date(0),
} as unknown as Industry
