import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import {
  adminUser,
  city,
  db,
  generatedPage,
  industry,
  pool,
  service,
  siteSetting,
} from '../lib/db'
import { SERVICE_OFFERING_SEED } from '../lib/service-offerings'
import { deleteIndustriesNotInList, importIndustriesFromXlsx } from '../lib/industries-import'
import { syncCitiesFromCsv } from '../lib/cities-csv-sync'
import { buildDefaultPricingPlans } from '../lib/default-pricing-plans'
import { buildSeedServiceSeoBody } from '../lib/seed-default-seo-body'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '../lib/neighborhood'

function loadEnvFile() {
  const envPath = join(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadEnvFile()

const sampleContent = {
  metaTitle: 'طراحی سایت کلینیک در تهران — تحویل ۱۴ روزه',
  metaDescription: 'طراحی سایت حرفه‌ای برای کلینیک‌ها و مطب‌های پزشکی در تهران. سایتی زیبا، سریع و بهینه برای موتورهای جستجو.',
  h1: 'طراحی سایت کلینیک در تهران',
  heroSubtitle: 'با یک سایت حرفه‌ای، بیماران بیشتری جذب کنید. تحویل در ۱۴ روز، پشتیبانی ۶ ماهه رایگان.',
  urgencyText: '🔥 فقط ۳ ظرفیت خالی این ماه — همین الان رزرو کنید',
  stats: { projects: '+۱۴۰', satisfaction: '۹۷٪', rating: '۴.۹' },
  benefits: [
    { title: 'طراحی اختصاصی', desc: 'سایت منحصربه‌فرد برای کلینیک شما، نه قالب‌های آماده' },
    { title: 'سئوی پیشرفته', desc: 'رتبه‌بندی بالا در جستجوی گوگل برای بیماران محلی' },
    { title: 'بهینه برای موبایل', desc: 'نمایش عالی روی تمام دستگاه‌ها و مرورگرها' },
    { title: 'پشتیبانی ۶ ماهه', desc: 'پشتیبانی فنی کامل بدون هزینه اضافه' },
  ],
  processSteps: [
    { title: 'مشاوره رایگان', desc: 'بررسی نیازها و اهداف کلینیک شما', timing: 'روز اول' },
    { title: 'طراحی و تایید', desc: 'ارائه پیش‌نویس طراحی و دریافت نظرات', timing: 'روز ۳ تا ۵' },
    { title: 'توسعه سایت', desc: 'کدنویسی کامل با سرعت بالا', timing: 'روز ۶ تا ۱۲' },
    { title: 'تحویل نهایی', desc: 'راه‌اندازی روی سرور و آموزش مدیریت', timing: 'روز ۱۴' },
  ],
  testimonials: [
    { text: 'سایت کلینیکم از وقتی راه‌اندازی شد، تعداد بیماران جدیدم دو برابر شده. واقعاً راضیم.', name: 'دکتر رضایی', business: 'کلینیک تخصصی قلب', initials: 'ر' },
    { text: 'طراحی فوق‌العاده و تحویل به موقع. تیم پشتیبانی هم همیشه پاسخگوست.', name: 'دکتر احمدی', business: 'مطب عمومی', initials: 'ا' },
  ],
  faq: [
    { q: 'چقدر طول می‌کشد سایت آماده شود؟', a: 'معمولاً ۱۴ روز کاری از تاریخ شروع همکاری.' },
    { q: 'آیا می‌توانم سایت را خودم مدیریت کنم؟', a: 'بله، پنل مدیریت ساده‌ای خواهید داشت و آموزش کامل می‌گیرید.' },
    { q: 'هزینه نگهداری سالانه چقدر است؟', a: 'هزینه هاستینگ و دامنه سالانه حدود ۵۰۰ هزار تومان است.' },
    { q: 'آیا سایت برای موبایل بهینه است؟', a: 'بله، تمام سایت‌های ما ۱۰۰٪ ریسپانسیو هستند.' },
  ],
  ctaHeading: 'همین الان سایت کلینیکتان را سفارش دهید',
  ctaSubtext: 'مشاوره اولیه کاملاً رایگان است. با ما تماس بگیرید.',
  whatsappText: 'سلام، می‌خوام برای طراحی سایت کلینیکم در تهران مشاوره بگیرم',
}

async function main() {
  console.log('Seeding services (admin-managed catalog)...')
  for (const s of SERVICE_OFFERING_SEED) {
    const plans = buildDefaultPricingPlans(s.priceTier)
    const seoBody = buildSeedServiceSeoBody(s.fa)
    const now = new Date()
    await db
      .insert(service)
      .values({
        id: randomUUID(),
        slug: s.slug,
        fa: s.fa,
        excelCode: s.code,
        priceTier: s.priceTier,
        sortOrder: s.sortOrder,
        pricingPlans: plans,
        seoBody,
        active: true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: service.slug,
        set: {
          fa: s.fa,
          excelCode: s.code,
          priceTier: s.priceTier,
          sortOrder: s.sortOrder,
          pricingPlans: plans,
          seoBody,
          active: true,
          updatedAt: now,
        },
      })
  }
  console.log(`✓ ${SERVICE_OFFERING_SEED.length} services seeded`)

  const citiesCsvPath = `${process.cwd()}/cites.csv`
  if (existsSync(citiesCsvPath)) {
    console.log('Syncing cities from cites.csv (removes cities not in file, keeps seoDescription on update)...')
    const n = await syncCitiesFromCsv(db, citiesCsvPath)
    console.log(`✓ ${n} cities synced`)
  } else {
    console.warn('⚠️  No cites.csv at project root — skip city sync. Add cites.csv or run: npm run db:sync-cities')
  }

  const xlsxPath = `${process.cwd()}/data/200-industries-iran-web-agency.xlsx`
  if (existsSync(xlsxPath)) {
    console.log('Importing industries from Excel...')
    const { count, slugs } = await importIndustriesFromXlsx(db, xlsxPath)
    const removed = await deleteIndustriesNotInList(db, slugs)
    console.log(
      `✓ ${count} industries from Excel; removed ${removed} industry row(s) not in the sheet`
    )
  } else {
    console.warn('⚠️  No Excel at data/200-industries-iran-web-agency.xlsx — skip industry import. Run: npm run db:import-industries')
  }

  console.log('Seeding admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await db
    .insert(adminUser)
    .values({
      id: randomUUID(),
      email: 'admin@webagency.ir',
      password: hashedPassword,
    })
    .onConflictDoNothing({ target: adminUser.email })
  console.log('✓ Admin user seeded (email: admin@webagency.ir, password: admin123)')

  console.log('Seeding sample pages...')
  const samplePages = [
    { industrySlug: 'dentistry', citySlug: 'tehran', service: 'web-design' },
    { industrySlug: 'pediatric-dentistry', citySlug: 'isfahan', service: 'web-design' },
    { industrySlug: 'restaurants-fast-food', citySlug: 'mashhad', service: 'web-design' },
    { industrySlug: 'gym-bodybuilding', citySlug: 'tehran', service: 'seo' },
    { industrySlug: 'real-estate-agency', citySlug: 'shiraz', service: 'seo' },
    { industrySlug: 'orthodontics', citySlug: 'tehran', service: 'social-media' },
    { industrySlug: 'travel-agency', citySlug: 'tabriz', service: 'social-media' },
    { industrySlug: 'online-clothing-store', citySlug: 'tehran', service: 'e-commerce' },
    { industrySlug: 'online-pharmacy', citySlug: 'karaj', service: 'mobile-app' },
    { industrySlug: 'printing-advertising', citySlug: 'mashhad', service: 'site-support' },
    { industrySlug: 'lawyer-legal-consulting', citySlug: 'shiraz', service: 'content' },
    { industrySlug: 'travel-agency', citySlug: 'qom', service: 'bot' },
  ]

  for (const p of samplePages) {
    const [indRow] = await db.select().from(industry).where(eq(industry.slug, p.industrySlug)).limit(1)
    const [cityRow] = await db.select().from(city).where(eq(city.slug, p.citySlug)).limit(1)
    if (!indRow || !cityRow) continue

    const now = new Date()
    await db
      .insert(generatedPage)
      .values({
        id: randomUUID(),
        industryId: indRow.id,
        cityId: cityRow.id,
        neighborhoodKey: CITY_LEVEL_NEIGHBORHOOD_KEY,
        service: p.service,
        content: sampleContent,
        cacheVersion: 'v1',
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing({
        target: [
          generatedPage.industryId,
          generatedPage.cityId,
          generatedPage.neighborhoodKey,
          generatedPage.cacheVersion,
          generatedPage.service,
        ],
      })
  }
  console.log(`✓ ${samplePages.length} sample pages seeded`)

  console.log('Seeding site settings...')
  const settings = [
    { key: 'contact_phone',    value: '02112345678' },
    { key: 'contact_whatsapp', value: '989123456789' },
    { key: 'contact_telegram', value: 'https://t.me/webagency' },
    { key: 'contact_bale',     value: 'https://ble.ir/webagency' },
    { key: 'contact_rubika',   value: 'https://rubika.ir/webagency' },
    { key: 'contact_eita',     value: 'https://eitaa.com/webagency' },
    { key: 'contact_address',  value: 'تهران، خیابان ولیعصر، پلاک ۱۲۳' },
    { key: 'contact_hours',    value: 'شنبه تا چهارشنبه ۹–۱۸، پنجشنبه ۹–۱۳' },
  ]
  const sNow = new Date()
  for (const s of settings) {
    await db
      .insert(siteSetting)
      .values({ key: s.key, value: s.value, updatedAt: sNow })
      .onConflictDoNothing({ target: siteSetting.key })
  }
  console.log(`✓ ${settings.length} site settings seeded`)
  console.log('\n⚠️  IMPORTANT: Change the admin password before deploying to production!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    return pool.end()
  })
