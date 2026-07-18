import { sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

/** Matches Prisma default PostgreSQL table/column names (PascalCase tables). */
export const city = pgTable('City', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  fa: text('fa').notNull(),
  province: text('province').notNull(),
  seoDescription: text('seoDescription').notNull().default(''),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const industry = pgTable('Industry', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  fa: text('fa').notNull(),
  desc: text('desc').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  category: text('category'),
  searchDemand: integer('searchDemand'),
  competition: text('competition'),
  suggestedCodes: text('suggestedCodes'),
  suggestedServices: text('suggestedServices').array().notNull().default(sql`ARRAY[]::text[]`),
})

export const service = pgTable('Service', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  fa: text('fa').notNull(),
  seoBody: text('seoBody').notNull(),
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  pricingPlans: jsonb('pricingPlans').notNull(),
  excelCode: text('excelCode').unique(),
  priceTier: integer('priceTier').notNull().default(2),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sortOrder').notNull().default(0),
  rootHeroJson: jsonb('rootHeroJson'),
  /** تحویل‌ها و «چه می‌کنیم» — ساختار ServiceDeliverables */
  deliverables: jsonb('deliverables'),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const job = pgTable('Job', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  fa: text('fa').notNull(),
  seoBody: text('seoBody').notNull(),
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  pricingPlans: jsonb('pricingPlans'),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sortOrder').notNull().default(0),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const neighborhood = pgTable(
  'Neighborhood',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    fa: text('fa').notNull(),
    cityId: text('cityId').notNull(),
    seoDescription: text('seoDescription').notNull().default(''),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    citySlugUnique: uniqueIndex('Neighborhood_cityId_slug_key').on(t.cityId, t.slug),
  })
)

export const generatedPage = pgTable(
  'GeneratedPage',
  {
    id: text('id').primaryKey(),
    industryId: text('industryId').notNull(),
    cityId: text('cityId').notNull(),
    service: text('service').notNull().default('web-design'),
    neighborhoodKey: text('neighborhoodKey').notNull().default('__city__'),
    content: jsonb('content').notNull(),
    cacheVersion: text('cacheVersion').notNull().default('v1'),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    composite: uniqueIndex(
      'GeneratedPage_industryId_cityId_neighborhoodKey_cacheVersion_service_key'
    ).on(t.industryId, t.cityId, t.neighborhoodKey, t.cacheVersion, t.service),
  })
)

export const generatedJobPage = pgTable(
  'GeneratedJobPage',
  {
    id: text('id').primaryKey(),
    jobId: text('jobId').notNull(),
    cityId: text('cityId').notNull(),
    content: jsonb('content').notNull(),
    cacheVersion: text('cacheVersion').notNull().default('v1'),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    composite: uniqueIndex('GeneratedJobPage_jobId_cityId_cacheVersion_key').on(
      t.jobId,
      t.cityId,
      t.cacheVersion
    ),
  })
)

export const adminUser = pgTable('AdminUser', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const siteSetting = pgTable('SiteSetting', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const blogPost = pgTable('BlogPost', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  body: text('body').notNull(),
  serviceCategory: text('serviceCategory').notNull(),
  published: boolean('published').notNull().default(false),
  publishedAt: timestamp('publishedAt', { mode: 'date', precision: 3 }),
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const contactMessage = pgTable('ContactMessage', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

/** Customer portal — end users (separate from AdminUser). */
export const customerUser = pgTable('CustomerUser', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull().default(''),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

/** Order for a service plan; amount in Rial (IRR). */
export const customerOrder = pgTable(
  'CustomerOrder',
  {
    id: text('id').primaryKey(),
    customerId: text('customerId')
      .notNull()
      .references(() => customerUser.id, { onDelete: 'cascade' }),
    serviceId: text('serviceId')
      .notNull()
      .references(() => service.id),
    planIndex: integer('planIndex').notNull(),
    planSnapshot: jsonb('planSnapshot').notNull(),
    status: text('status').notNull().default('draft'),
    /** Rial (integer, fits typical plan sizes). */
    amountRial: integer('amountRial').notNull(),
    currency: text('currency').notNull().default('IRR'),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    customerIdx: index('CustomerOrder_customerId_idx').on(t.customerId),
  })
)

export const paymentTransaction = pgTable(
  'PaymentTransaction',
  {
    id: text('id').primaryKey(),
    orderId: text('orderId')
      .notNull()
      .references(() => customerOrder.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(),
    authority: text('authority'),
    refId: text('refId'),
    status: text('status').notNull().default('pending'),
    rawPayload: jsonb('rawPayload'),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    orderIdx: index('PaymentTransaction_orderId_idx').on(t.orderId),
  })
)

export const contractAcceptance = pgTable(
  'ContractAcceptance',
  {
    id: text('id').primaryKey(),
    customerId: text('customerId')
      .notNull()
      .references(() => customerUser.id, { onDelete: 'cascade' }),
    orderId: text('orderId')
      .notNull()
      .references(() => customerOrder.id, { onDelete: 'cascade' }),
    termsVersion: text('termsVersion').notNull(),
    termsHash: text('termsHash'),
    acceptedAt: timestamp('acceptedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    ip: text('ip').notNull().default(''),
    userAgent: text('userAgent').notNull().default(''),
  },
  (t) => ({
    orderUnique: uniqueIndex('ContractAcceptance_orderId_key').on(t.orderId),
  })
)

export const supportTicket = pgTable(
  'SupportTicket',
  {
    id: text('id').primaryKey(),
    customerId: text('customerId')
      .notNull()
      .references(() => customerUser.id, { onDelete: 'cascade' }),
    subject: text('subject').notNull(),
    status: text('status').notNull().default('open'),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    customerIdx: index('SupportTicket_customerId_idx').on(t.customerId),
  })
)

export const ticketMessage = pgTable(
  'TicketMessage',
  {
    id: text('id').primaryKey(),
    ticketId: text('ticketId')
      .notNull()
      .references(() => supportTicket.id, { onDelete: 'cascade' }),
    fromCustomer: boolean('fromCustomer').notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    ticketIdx: index('TicketMessage_ticketId_idx').on(t.ticketId),
  })
)

/** پنل دانشجو — ورود با موبایل و رمز تولیدشده در ادمین */
export const studentUser = pgTable('StudentUser', {
  id: text('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull().default(''),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const studentEnrollment = pgTable(
  'StudentEnrollment',
  {
    id: text('id').primaryKey(),
    studentId: text('studentId')
      .notNull()
      .references(() => studentUser.id, { onDelete: 'cascade' }),
    courseTitle: text('courseTitle').notNull(),
    courseDescription: text('courseDescription').notNull().default(''),
    sessionCount: integer('sessionCount').notNull().default(0),
    /** Number of class sessions marked as completed by admin (sessions 1..N). */
    sessionsCompletedCount: integer('sessionsCompletedCount').notNull().default(0),
    priceToman: integer('priceToman').notNull(),
    /** full | split — null until student chooses */
    paymentPlan: text('paymentPlan'),
    teacherName: text('teacherName').notNull().default(''),
    teacherPhone: text('teacherPhone').notNull().default(''),
    paymentCardNumber: text('paymentCardNumber').notNull().default(''),
    paymentShaba: text('paymentShaba').notNull().default(''),
    paymentCardHolder: text('paymentCardHolder').notNull().default(''),
    paymentBankName: text('paymentBankName').notNull().default(''),
    /** Admin can unlock 2nd installment before mid-course date */
    secondPaymentUnlocked: boolean('secondPaymentUnlocked').notNull().default(false),
    status: text('status').notNull().default('pending_contract'),
    courseStartsAt: timestamp('courseStartsAt', { mode: 'date', precision: 3 }),
    courseEndsAt: timestamp('courseEndsAt', { mode: 'date', precision: 3 }),
    jobSlug: text('jobSlug'),
    adminNotes: text('adminNotes').notNull().default(''),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    studentIdx: index('StudentEnrollment_studentId_idx').on(t.studentId),
  })
)

export const studentSession = pgTable(
  'StudentSession',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollmentId')
      .notNull()
      .references(() => studentEnrollment.id, { onDelete: 'cascade' }),
    sessionNumber: integer('sessionNumber').notNull(),
    startsAt: timestamp('startsAt', { mode: 'date', precision: 3 }).notNull(),
    endsAt: timestamp('endsAt', { mode: 'date', precision: 3 }).notNull(),
    note: text('note').notNull().default(''),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    enrollmentIdx: index('StudentSession_enrollmentId_idx').on(t.enrollmentId),
  })
)

export const studentPayment = pgTable(
  'StudentPayment',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollmentId')
      .notNull()
      .references(() => studentEnrollment.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    amountToman: integer('amountToman').notNull(),
    /** pending | reported | confirmed */
    status: text('status').notNull().default('pending'),
    reportedAt: timestamp('reportedAt', { mode: 'date', precision: 3 }),
    confirmedAt: timestamp('confirmedAt', { mode: 'date', precision: 3 }),
    confirmedByAdminId: text('confirmedByAdminId').references(() => adminUser.id),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    enrollmentSeqUnique: uniqueIndex('StudentPayment_enrollmentId_sequence_key').on(
      t.enrollmentId,
      t.sequence
    ),
  })
)

export const studentContractAcceptance = pgTable(
  'StudentContractAcceptance',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollmentId')
      .notNull()
      .references(() => studentEnrollment.id, { onDelete: 'cascade' }),
    termsVersion: text('termsVersion').notNull(),
    acceptedAt: timestamp('acceptedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    ip: text('ip').notNull().default(''),
    userAgent: text('userAgent').notNull().default(''),
  },
  (t) => ({
    enrollmentUnique: uniqueIndex('StudentContractAcceptance_enrollmentId_key').on(t.enrollmentId),
  })
)

export const studentCertificate = pgTable(
  'StudentCertificate',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollmentId')
      .notNull()
      .references(() => studentEnrollment.id, { onDelete: 'cascade' }),
    trackingNumber: text('trackingNumber').notNull().unique(),
    studentName: text('studentName').notNull(),
    courseTitle: text('courseTitle').notNull(),
    sessionCount: integer('sessionCount').notNull(),
    issuedAt: timestamp('issuedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    enrollmentUnique: uniqueIndex('StudentCertificate_enrollmentId_key').on(t.enrollmentId),
    trackingIdx: index('StudentCertificate_trackingNumber_idx').on(t.trackingNumber),
  })
)

/** Admin-issued English PDF certificate — standalone, not tied to student portal */
export const trainingCertificate = pgTable(
  'TrainingCertificate',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollmentId').references(() => studentEnrollment.id, { onDelete: 'set null' }),
    studentId: text('studentId').references(() => studentUser.id, { onDelete: 'set null' }),
    trackingNumber: text('trackingNumber').notNull().unique(),
    studentName: text('studentName').notNull(),
    skillTitle: text('skillTitle').notNull(),
    teacherName: text('teacherName').notNull(),
    courseTitle: text('courseTitle').notNull(),
    durationText: text('durationText').notNull(),
    totalHours: integer('totalHours').notNull().default(0),
    sessionCount: integer('sessionCount').notNull(),
    courseStartsAt: timestamp('courseStartsAt', { mode: 'date', precision: 3 }),
    courseEndsAt: timestamp('courseEndsAt', { mode: 'date', precision: 3 }),
    issuedAt: timestamp('issuedAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  },
  (t) => ({
    trackingIdx: index('TrainingCertificate_trackingNumber_idx').on(t.trackingNumber),
  })
)

export type City = typeof city.$inferSelect
export type Industry = typeof industry.$inferSelect
export type Service = typeof service.$inferSelect
export type Job = typeof job.$inferSelect
export type Neighborhood = typeof neighborhood.$inferSelect
export type GeneratedPage = typeof generatedPage.$inferSelect
export type GeneratedJobPage = typeof generatedJobPage.$inferSelect
export type AdminUser = typeof adminUser.$inferSelect
export type SiteSetting = typeof siteSetting.$inferSelect
export type BlogPost = typeof blogPost.$inferSelect
export type ContactMessage = typeof contactMessage.$inferSelect
export type CustomerUser = typeof customerUser.$inferSelect
export type CustomerOrder = typeof customerOrder.$inferSelect
export type PaymentTransaction = typeof paymentTransaction.$inferSelect
export type ContractAcceptance = typeof contractAcceptance.$inferSelect
export type SupportTicket = typeof supportTicket.$inferSelect
export type TicketMessage = typeof ticketMessage.$inferSelect
export type StudentUser = typeof studentUser.$inferSelect
export type StudentEnrollment = typeof studentEnrollment.$inferSelect
export type StudentSession = typeof studentSession.$inferSelect
export type StudentPayment = typeof studentPayment.$inferSelect
export type StudentContractAcceptance = typeof studentContractAcceptance.$inferSelect
export type StudentCertificate = typeof studentCertificate.$inferSelect
export type TrainingCertificate = typeof trainingCertificate.$inferSelect
