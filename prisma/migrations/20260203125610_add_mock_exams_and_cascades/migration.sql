-- CreateEnum
CREATE TYPE "KnowledgeArea" AS ENUM ('LANGUAGES', 'HUMANITIES', 'NATURAL_SCIENCES', 'MATHEMATICS');

-- DropForeignKey
ALTER TABLE "essays" DROP CONSTRAINT "essays_authorId_fkey";

-- DropForeignKey
ALTER TABLE "student_teachers" DROP CONSTRAINT "student_teachers_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student_teachers" DROP CONSTRAINT "student_teachers_teacherId_fkey";

-- CreateTable
CREATE TABLE "mock_exams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "mock_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area_performances" (
    "id" TEXT NOT NULL,
    "mockExamId" TEXT NOT NULL,
    "area" "KnowledgeArea" NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "certaintyCount" INTEGER NOT NULL,
    "doubtCount" INTEGER NOT NULL,
    "distractionCount" INTEGER NOT NULL,
    "interpretationCount" INTEGER NOT NULL,

    CONSTRAINT "area_performances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "area_performances_mockExamId_area_key" ON "area_performances"("mockExamId", "area");

-- AddForeignKey
ALTER TABLE "student_teachers" ADD CONSTRAINT "student_teachers_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_teachers" ADD CONSTRAINT "student_teachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essays" ADD CONSTRAINT "essays_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_exams" ADD CONSTRAINT "mock_exams_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_performances" ADD CONSTRAINT "area_performances_mockExamId_fkey" FOREIGN KEY ("mockExamId") REFERENCES "mock_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Validação para Acertos Totais
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_correct_count" 
CHECK ("correctCount" BETWEEN 0 AND 45);

-- Validação para Acertos com Certeza
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_certainty_count" 
CHECK ("certaintyCount" BETWEEN 0 AND 45);

-- Validação para Acertos com Dúvida (Chute)
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_doubt_count" 
CHECK ("doubtCount" BETWEEN 0 AND 45);

-- Validação para Erros por Distração
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_distraction_count" 
CHECK ("distractionCount" BETWEEN 0 AND 45);

-- Validação para Erros por Interpretação
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_interpretation_count" 
CHECK ("interpretationCount" BETWEEN 0 AND 45);
