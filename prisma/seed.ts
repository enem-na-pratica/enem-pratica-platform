import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import {
  KnowledgeArea,
  Role,
  TopicStatus,
} from '@/src/generated/prisma/client';

// Senha padrão: 0123456789
const DEFAULT_PASSWORD =
  '$2b$12$8QHdhZ8bP4tLH.ZjaOKNpuCQUt5plrgKfbCUKEGX1Gc2hDmSGewkC';

export async function clearDatabase() {
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️ Tentativa de limpar o banco em PRODUÇÃO abortada!');
    return;
  }

  console.log('🧹 Limpando todas as tabelas...');
  const tableNames = await prisma.$queryRaw<Array<{ tableName: string }>>`
    SELECT tablename AS "tableName" FROM pg_tables WHERE schemaname='public'
  `;

  const tables = tableNames
    .map(({ tableName }) => tableName)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`,
    );
    console.log('✅ Banco de dados resetado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
  }
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ SEED NÃO PODE SER EXECUTADA EM PRODUÇÃO!');
    process.exit(1);
  }

  await clearDatabase();

  console.log('🌱 Iniciando seed...');

  // ──────────────────────────────────────────────
  // USERS
  // ──────────────────────────────────────────────

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      username: 'superadmin',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.SUPER_ADMIN,
    },
  });

  const admin1 = await prisma.user.create({
    data: {
      name: 'Admin Um',
      username: 'admin1',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.ADMIN,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'Admin Dois',
      username: 'admin2',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.ADMIN,
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      name: 'Professor Um',
      username: 'teacher1',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.TEACHER,
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: 'Professor Dois',
      username: 'teacher2',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.TEACHER,
    },
  });

  const teacher3 = await prisma.user.create({
    data: {
      name: 'Professor Três',
      username: 'teacher3',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.TEACHER,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Aluno Um',
      username: 'student1',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.STUDENT,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Aluno Dois',
      username: 'student2',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.STUDENT,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Aluno Três',
      username: 'student3',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.STUDENT,
    },
  });

  const student4 = await prisma.user.create({
    data: {
      name: 'Aluno Quatro',
      username: 'student4',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.STUDENT,
    },
  });

  const student5 = await prisma.user.create({
    data: {
      name: 'Aluno Cinco',
      username: 'student5',
      passwordHash: DEFAULT_PASSWORD,
      role: Role.STUDENT,
    },
  });

  console.log('✅ Usuários criados');

  // ──────────────────────────────────────────────
  // STUDENT ↔ TEACHER/ADMIN RELATIONS
  // student1 → admin1
  // student2 → admin2
  // student3 → teacher1
  // student4 → teacher2
  // student5 → teacher3
  // ──────────────────────────────────────────────

  await prisma.studentTeacher.createMany({
    data: [
      { studentId: student1.id, teacherId: admin1.id },
      { studentId: student2.id, teacherId: admin2.id },
      { studentId: student3.id, teacherId: teacher1.id },
      { studentId: student4.id, teacherId: teacher2.id },
      { studentId: student5.id, teacherId: teacher3.id },
    ],
  });

  console.log('✅ Relações aluno-professor criadas');

  // ──────────────────────────────────────────────
  // SUBJECTS & TOPICS
  // ──────────────────────────────────────────────

  const subject1 = await prisma.subject.create({
    data: {
      name: 'Matemática',
      slug: 'matematica',
      category: 'Exatas',
      topics: {
        create: [
          { title: 'Álgebra', position: 1 },
          { title: 'Geometria Plana', position: 2 },
          { title: 'Funções', position: 3 },
        ],
      },
    },
    include: { topics: true },
  });

  const subject2 = await prisma.subject.create({
    data: {
      name: 'Português',
      slug: 'portugues',
      category: 'Linguagens',
      topics: {
        create: [
          { title: 'Interpretação de Texto', position: 1 },
          { title: 'Gramática', position: 2 },
          { title: 'Redação', position: 3 },
        ],
      },
    },
    include: { topics: true },
  });

  console.log('✅ Matérias e tópicos criados');

  // ──────────────────────────────────────────────
  // USER TOPIC PROGRESS (students)
  // ──────────────────────────────────────────────

  const allTopics = [...subject1.topics, ...subject2.topics];
  const statuses = [
    TopicStatus.COMPREHENDED,
    TopicStatus.PRACTICE,
    TopicStatus.REVIEW,
  ];
  const students = [student1, student2, student3, student4, student5];

  for (const student of students) {
    for (let i = 0; i < allTopics.length; i++) {
      await prisma.userTopicProgress.create({
        data: {
          authorId: student.id,
          topicId: allTopics[i].id,
          status: statuses[i % statuses.length],
        },
      });
    }
  }

  console.log('✅ Progresso de tópicos criado');

  // ──────────────────────────────────────────────
  // ESSAYS (todos os usuários)
  // competências: múltiplos de 20, entre 0 e 200
  // ──────────────────────────────────────────────

  const allUsers = [
    superAdmin,
    admin1,
    admin2,
    teacher1,
    teacher2,
    teacher3,
    student1,
    student2,
    student3,
    student4,
    student5,
  ];

  const essayScores = [
    [160, 140, 180, 120, 200],
    [100, 120, 80, 160, 140],
    [200, 180, 160, 140, 120],
    [60, 80, 100, 120, 140],
    [180, 200, 160, 140, 180],
  ];

  for (let i = 0; i < allUsers.length; i++) {
    const scores = essayScores[i % essayScores.length];
    await prisma.essay.create({
      data: {
        authorId: allUsers[i].id,
        theme: `Tema de Redação ${i + 1}`,
        competency1: scores[0],
        competency2: scores[1],
        competency3: scores[2],
        competency4: scores[3],
        competency5: scores[4],
      },
    });
  }

  console.log('✅ Redações criadas');

  // ──────────────────────────────────────────────
  // MOCK EXAMS + AREA PERFORMANCES (todos os usuários)
  // valores entre 0 e 45
  // ──────────────────────────────────────────────

  const areas = [
    KnowledgeArea.LANGUAGES,
    KnowledgeArea.HUMANITIES,
    KnowledgeArea.NATURAL_SCIENCES,
    KnowledgeArea.MATHEMATICS,
  ];

  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    const mockExam = await prisma.mockExam.create({
      data: {
        title: `Simulado ${i + 1} - ${user.name}`,
        authorId: user.id,
      },
    });

    for (const area of areas) {
      await prisma.areaPerformance.create({
        data: {
          mockExamId: mockExam.id,
          area,
          correctCount: 30 + (i % 16),
          certaintyCount: 20 + (i % 10),
          doubtErrors: 4 + (i % 4),
          distractionErrors: 2 + (i % 3),
          interpretationErrors: 1 + (i % 2),
        },
      });
    }
  }

  console.log('✅ Simulados e desempenhos criados');

  // ──────────────────────────────────────────────
  // QUESTION SESSIONS (students apenas)
  // ──────────────────────────────────────────────

  for (const student of students) {
    for (const topic of allTopics) {
      const total = 10;
      const correct = Math.floor(Math.random() * (total + 1));

      await prisma.questionSession.create({
        data: {
          authorId: student.id,
          topicId: topic.id,
          total,
          correct,
          isReviewed: Math.random() > 0.5,
        },
      });
    }
  }

  console.log('✅ Sessões de questões criadas');
  console.log('🎉 Seed concluída com sucesso!');
}

main()
  .then(async () => {
    console.log('Banco de dados populado com sucesso.');
  })
  .catch(async (e) => {
    console.error('Erro ao popular o banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Conexão com o banco encerrada.');
  });
