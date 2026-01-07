import { ROLES } from '@/src/ui/constants/role.constant';
import { prisma } from './prisma';

// Senha padrão: 0123456789
const DEFAULT_PASSWORD = "$2b$12$8QHdhZ8bP4tLH.ZjaOKNpuCQUt5plrgKfbCUKEGX1Gc2hDmSGewkC";

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.user.deleteMany();

  console.log('Semeando novos usuários...');

  const usersData = [
    // 1 SUPER_ADMIN
    { name: 'Ricardo Cavalcanti', username: 'ricardo_super', role: ROLES.SUPER_ADMIN },

    // 2 ADMINS
    { name: 'Alice da Silva', username: 'alice_admin', role: ROLES.ADMIN },
    { name: 'Marcos Oliveira', username: 'marcos_gestor', role: ROLES.ADMIN },

    // 3 TEACHERS
    { name: 'Prof. Helena Soares', username: 'helena_soares', role: ROLES.TEACHER },
    { name: 'Dr. Arnaldo Antunes', username: 'arnaldo_historia', role: ROLES.TEACHER },
    { name: 'Beatriz Fagundes', username: 'beatriz_bio', role: ROLES.TEACHER },

    // 5 STUDENTS
    { name: 'Bob o Estudante', username: 'bob_student', role: ROLES.STUDENT },
    { name: 'Carolina Mendes', username: 'carol_mendes', role: ROLES.STUDENT },
    { name: 'Tiago Souza', username: 'tiago_souza', role: ROLES.STUDENT },
    { name: 'Larissa Ferreira', username: 'lari_ferreira', role: ROLES.STUDENT },
    { name: 'Enzo Gabriel', username: 'enzo_estudos', role: ROLES.STUDENT },
  ];

  for (const user of usersData) {
    await prisma.user.create({
      data: {
        ...user,
        passwordHash: DEFAULT_PASSWORD,
      },
    });
  }

  const count = await prisma.user.count();
  console.log(`Sucesso! Foram criados ${count} usuários.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Conexão com o banco encerrada.');
  })
  .catch(async (e) => {
    console.error('Erro ao popular o banco:', e);
    await prisma.$disconnect();
    process.exit(1);
  });