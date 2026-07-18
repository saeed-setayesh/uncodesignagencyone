CREATE TABLE IF NOT EXISTS "TrainingCertificate" (
  "id" text PRIMARY KEY NOT NULL,
  "enrollmentId" text NOT NULL UNIQUE REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE,
  "studentId" text NOT NULL REFERENCES "StudentUser"("id") ON DELETE CASCADE,
  "trackingNumber" text NOT NULL UNIQUE,
  "studentName" text NOT NULL,
  "skillTitle" text NOT NULL,
  "teacherName" text NOT NULL,
  "courseTitle" text NOT NULL,
  "durationText" text NOT NULL,
  "totalHours" integer NOT NULL DEFAULT 0,
  "sessionCount" integer NOT NULL,
  "courseStartsAt" timestamp(3),
  "courseEndsAt" timestamp(3),
  "issuedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "TrainingCertificate_trackingNumber_idx" ON "TrainingCertificate" ("trackingNumber");
