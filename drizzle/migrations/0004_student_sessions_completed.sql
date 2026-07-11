ALTER TABLE "StudentEnrollment" ADD COLUMN IF NOT EXISTS "sessionsCompletedCount" integer NOT NULL DEFAULT 0;
