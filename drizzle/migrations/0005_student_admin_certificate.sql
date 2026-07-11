-- Safe incremental updates (run with: npm run db:apply-student)

ALTER TABLE "StudentEnrollment" ADD COLUMN IF NOT EXISTS "paymentShaba" text NOT NULL DEFAULT '';
ALTER TABLE "StudentEnrollment" ADD COLUMN IF NOT EXISTS "sessionsCompletedCount" integer NOT NULL DEFAULT 0;
ALTER TABLE "StudentEnrollment" ADD COLUMN IF NOT EXISTS "secondPaymentUnlocked" boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "StudentCertificate" (
  "id" text PRIMARY KEY NOT NULL,
  "enrollmentId" text NOT NULL UNIQUE REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE,
  "trackingNumber" text NOT NULL UNIQUE,
  "studentName" text NOT NULL,
  "courseTitle" text NOT NULL,
  "sessionCount" integer NOT NULL,
  "issuedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "StudentCertificate_trackingNumber_idx" ON "StudentCertificate" ("trackingNumber");
