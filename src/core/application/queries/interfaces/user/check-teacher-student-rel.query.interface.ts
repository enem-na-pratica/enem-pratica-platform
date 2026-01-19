type CheckTeacherStudentRelDeps = { teacherId: string, studentId: string };

export interface CheckTeacherStudentRelQuery {
  checkTeacherStudentRel(ids: CheckTeacherStudentRelDeps): Promise<boolean>;
}