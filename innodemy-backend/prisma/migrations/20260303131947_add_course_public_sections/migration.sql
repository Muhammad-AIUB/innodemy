-- CreateEnum
CREATE TYPE "CoursePublicSectionType" AS ENUM ('HERO', 'MODULES', 'INSTRUCTORS', 'FEATURES', 'PROJECTS', 'TARGET_AUDIENCE', 'PREREQUISITES', 'FAQ', 'CUSTOM');

-- CreateTable
CREATE TABLE "CoursePublicSection" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "type" "CoursePublicSectionType" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL DEFAULT '[]',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursePublicSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoursePublicSection_courseId_idx" ON "CoursePublicSection"("courseId");

-- CreateIndex
CREATE INDEX "CoursePublicSection_order_idx" ON "CoursePublicSection"("order");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePublicSection_courseId_type_key" ON "CoursePublicSection"("courseId", "type");

-- AddForeignKey
ALTER TABLE "CoursePublicSection" ADD CONSTRAINT "CoursePublicSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
