/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subjects_slug_key" ON "subjects"("slug");

-- CreateIndex
CREATE INDEX "subjects_slug_idx" ON "subjects"("slug");
