import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

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

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const { randomUUID } = await import('node:crypto')
  const { SOFTWARE_PRODUCTS } = await import('@/lib/software-products-data')
  const { buildSoftwareSeoBodyMarkdown } = await import('@/lib/software-seo-body')
  const { buildSoftwarePricingPlans } = await import('@/lib/software-pricing-plans')
  const { SOFTWARE_SLUG_PREFIX } = await import('@/lib/software-products')
  const { db, service } = await import('@/lib/db')

  const now = new Date()
  let upserted = 0

  for (let i = 0; i < SOFTWARE_PRODUCTS.length; i++) {
    const product = SOFTWARE_PRODUCTS[i]!
    if (!product.slug.startsWith(SOFTWARE_SLUG_PREFIX)) {
      throw new Error(`Invalid slug: ${product.slug}`)
    }

    const seoBody = buildSoftwareSeoBodyMarkdown({
      fa: product.fa,
      en: product.en,
      metaDescription: product.metaDescription,
    })
    const metaTitle = `سفارش ${product.fa}`.slice(0, 70)
    const pricingPlans = buildSoftwarePricingPlans(product.fa)

    await db
      .insert(service)
      .values({
        id: randomUUID(),
        slug: product.slug,
        fa: product.fa,
        seoBody,
        metaTitle,
        metaDescription: product.metaDescription.slice(0, 165),
        pricingPlans,
        priceTier: 3,
        sortOrder: 6000 + i,
        active: true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: service.slug,
        set: {
          fa: product.fa,
          seoBody,
          metaTitle,
          metaDescription: product.metaDescription.slice(0, 165),
          pricingPlans,
          sortOrder: 6000 + i,
          active: true,
          updatedAt: new Date(),
        },
      })

    upserted++
  }

  console.log(`✓ Upserted ${upserted} software products`)
  console.log(`  Hub: /software`)
  console.log(`  Example: /software/${SOFTWARE_PRODUCTS[0]?.slug.replace(/^software-/, '')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
