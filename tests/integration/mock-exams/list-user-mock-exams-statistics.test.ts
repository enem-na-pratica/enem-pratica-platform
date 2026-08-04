const TEST_STUDENT_USERNAME = 'student.examstats.teste';
const TEST_STUDENT2_USERNAME = 'student2.examstats.teste';
const TEST_TEACHER_USERNAME = 'teacher.examstats.teste';
const TEST_TEACHER2_USERNAME = 'teacher2.examstats.teste';
const TEST_ADMIN_USERNAME = 'admin.examstats.teste';

const ALL_TEST_USERNAMES = [
  TEST_STUDENT_USERNAME,
  TEST_STUDENT2_USERNAME,
  TEST_TEACHER_USERNAME,
  TEST_TEACHER2_USERNAME,
  TEST_ADMIN_USERNAME,
];

const MEDIUM_PROFILE = {
  correctCount: 30,
  certaintyCount: 20,
  doubtErrors: 3,
  distractionErrors: 5,
  interpretationErrors: 4,
};

const PERFECT_PROFILE = {
  correctCount: 45,
  certaintyCount: 45,
  doubtErrors: 0,
  distractionErrors: 0,
  interpretationErrors: 0,
};

type AreaMetrics = {
  correctCount: number;
  certaintyCount: number;
  doubtErrors: number;
  distractionErrors: number;
  interpretationErrors: number;
};

const PRISMA_AREAS = [
  'LANGUAGES',
  'HUMANITIES',
  'NATURAL_SCIENCES',
  'MATHEMATICS',
] as const;
