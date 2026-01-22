export interface StudentTeacherRepository {
  isStudentAssignedToTeacher(
    assignmentIds: { studentId: string, teacherId: string }
  ): Promise<boolean>;
}
