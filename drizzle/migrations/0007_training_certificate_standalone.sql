-- Standalone certificates: optional student link, admin-filled data only
DROP INDEX IF EXISTS "TrainingCertificate_enrollmentId_key";

ALTER TABLE "TrainingCertificate" DROP CONSTRAINT IF EXISTS "TrainingCertificate_enrollmentId_fkey";
ALTER TABLE "TrainingCertificate" DROP CONSTRAINT IF EXISTS "TrainingCertificate_studentId_fkey";

ALTER TABLE "TrainingCertificate" ALTER COLUMN "enrollmentId" DROP NOT NULL;
ALTER TABLE "TrainingCertificate" ALTER COLUMN "studentId" DROP NOT NULL;

ALTER TABLE "TrainingCertificate"
  ADD CONSTRAINT "TrainingCertificate_enrollmentId_fkey"
  FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE SET NULL;

ALTER TABLE "TrainingCertificate"
  ADD CONSTRAINT "TrainingCertificate_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "StudentUser"("id") ON DELETE SET NULL;
