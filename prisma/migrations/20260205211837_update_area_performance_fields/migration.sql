/*
  Warnings:

  - You are about to drop the column `distractionCount` on the `area_performances` table. All the data in the column will be lost.
  - You are about to drop the column `doubtCount` on the `area_performances` table. All the data in the column will be lost.
  - You are about to drop the column `interpretationCount` on the `area_performances` table. All the data in the column will be lost.
  - Added the required column `distractionErrors` to the `area_performances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doubtErrors` to the `area_performances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doubtHits` to the `area_performances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interpretationErrors` to the `area_performances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "area_performances" DROP COLUMN "distractionCount",
DROP COLUMN "doubtCount",
DROP COLUMN "interpretationCount",
ADD COLUMN     "distractionErrors" INTEGER NOT NULL,
ADD COLUMN     "doubtErrors" INTEGER NOT NULL,
ADD COLUMN     "doubtHits" INTEGER NOT NULL,
ADD COLUMN     "interpretationErrors" INTEGER NOT NULL;

-- Remove old constraints, if they exist
ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_correct_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_certainty_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_doubt_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_distraction_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_interpretation_count";

-- Total Correct Answers
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_correct_count" 
CHECK ("correctCount" BETWEEN 0 AND 45);

-- Correct Answers with Certainty
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_certainty_count" 
CHECK ("certaintyCount" BETWEEN 0 AND 45);

-- Doubt, but Answered Correctly
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_doubt_hits" 
CHECK ("doubtHits" BETWEEN 0 AND 45);

-- Doubt, and Answered Incorrectly
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_doubt_errors" 
CHECK ("doubtErrors" BETWEEN 0 AND 45);

-- Wrong Due to Distraction
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_distraction_errors" 
CHECK ("distractionErrors" BETWEEN 0 AND 45);

-- Wrong Due to Misinterpretation
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_interpretation_errors" 
CHECK ("interpretationErrors" BETWEEN 0 AND 45);