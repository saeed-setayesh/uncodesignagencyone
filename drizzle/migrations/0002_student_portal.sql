CREATE TABLE IF NOT EXISTS "StudentUser" (
  "id" text PRIMARY KEY NOT NULL,
  "phone" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "name" text NOT NULL DEFAULT '',
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "StudentEnrollment" (
  "id" text PRIMARY KEY NOT NULL,
  "studentId" text NOT NULL REFERENCES "StudentUser"("id") ON DELETE CASCADE,
  "courseTitle" text NOT NULL,
  "courseDescription" text NOT NULL DEFAULT '',
  "sessionCount" integer NOT NULL DEFAULT 0,
  "priceToman" integer NOT NULL,
  "paymentPlan" text,
  "teacherName" text NOT NULL DEFAULT '',
  "teacherPhone" text NOT NULL DEFAULT '',
  "paymentCardNumber" text NOT NULL DEFAULT '',
  "paymentCardHolder" text NOT NULL DEFAULT '',
  "paymentBankName" text NOT NULL DEFAULT '',
  "status" text NOT NULL DEFAULT 'pending_contract',
  "courseStartsAt" timestamp(3),
  "courseEndsAt" timestamp(3),
  "jobSlug" text,
  "adminNotes" text NOT NULL DEFAULT '',
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "StudentEnrollment_studentId_idx" ON "StudentEnrollment" ("studentId");

CREATE TABLE IF NOT EXISTS "StudentSession" (
  "id" text PRIMARY KEY NOT NULL,
  "enrollmentId" text NOT NULL REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE,
  "sessionNumber" integer NOT NULL,
  "startsAt" timestamp(3) NOT NULL,
  "endsAt" timestamp(3) NOT NULL,
  "note" text NOT NULL DEFAULT '',
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "StudentSession_enrollmentId_idx" ON "StudentSession" ("enrollmentId");

CREATE TABLE IF NOT EXISTS "StudentPayment" (
  "id" text PRIMARY KEY NOT NULL,
  "enrollmentId" text NOT NULL REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE,
  "sequence" integer NOT NULL,
  "amountToman" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "reportedAt" timestamp(3),
  "confirmedAt" timestamp(3),
  "confirmedByAdminId" text REFERENCES "AdminUser"("id"),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "StudentPayment_enrollmentId_sequence_key" ON "StudentPayment" ("enrollmentId", "sequence");

CREATE TABLE IF NOT EXISTS "StudentContractAcceptance" (
  "id" text PRIMARY KEY NOT NULL,
  "enrollmentId" text NOT NULL REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE,
  "termsVersion" text NOT NULL,
  "acceptedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ip" text NOT NULL DEFAULT '',
  "userAgent" text NOT NULL DEFAULT ''
);

CREATE UNIQUE INDEX IF NOT EXISTS "StudentContractAcceptance_enrollmentId_key" ON "StudentContractAcceptance" ("enrollmentId");
