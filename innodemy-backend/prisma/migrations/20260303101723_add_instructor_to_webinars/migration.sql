-- CreateEnum
CREATE TYPE "InstructorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "status" "InstructorStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Webinar" ADD COLUMN     "instructorId" TEXT;

-- CreateIndex
CREATE INDEX "Instructor_status_idx" ON "Instructor"("status");

-- CreateIndex
CREATE INDEX "Webinar_instructorId_idx" ON "Webinar"("instructorId");

-- AddForeignKey
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
