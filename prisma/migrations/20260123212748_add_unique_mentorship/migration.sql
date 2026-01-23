/*
  Warnings:

  - A unique constraint covering the columns `[studentId,teacherId]` on the table `student_teachers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_teachers_studentId_teacherId_key" ON "student_teachers"("studentId", "teacherId");
