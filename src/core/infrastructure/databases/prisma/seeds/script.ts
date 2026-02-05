import { ROLES } from "../../../../domain/auth";
import { prisma } from '../prisma';

// Senha padrão: 0123456789
const DEFAULT_PASSWORD = "$2b$12$8QHdhZ8bP4tLH.ZjaOKNpuCQUt5plrgKfbCUKEGX1Gc2hDmSGewkC";

const USERS_DATA = [
  // 1 SUPER_ADMIN
  {
    name: 'Ricardo Cavalcanti',
    username: 'ricardo_super',
    role: ROLES.SUPER_ADMIN,
    passwordHash: DEFAULT_PASSWORD,
  },

  // 2 ADMINS
  {
    name: 'Alice da Silva',
    username: 'alice_admin',
    role: ROLES.ADMIN,
    passwordHash: DEFAULT_PASSWORD,
  },
  {
    name: 'Marcos Oliveira',
    username: 'marcos_gestor',
    role: ROLES.ADMIN,
    passwordHash: DEFAULT_PASSWORD,
  },

  // 3 TEACHERS
  {
    name: 'Prof. Helena Soares',
    username: 'helena_soares',
    role: ROLES.TEACHER,
    passwordHash: DEFAULT_PASSWORD,
  },
  {
    name: 'Dr. Arnaldo Antunes',
    username: 'arnaldo_historia',
    role: ROLES.TEACHER,
    passwordHash: DEFAULT_PASSWORD,
  },
  {
    name: 'Beatriz Fagundes',
    username: 'beatriz_bio',
    role: ROLES.TEACHER,
    passwordHash: DEFAULT_PASSWORD,
  },

  // 5 STUDENTS
  {
    name: 'Nathyelle Correia',
    username: 'nathy_correia',
    role: ROLES.STUDENT,
    passwordHash: DEFAULT_PASSWORD,
  },
  {
    name: 'Carolina Mendes',
    username: 'carol_mendes',
    role: ROLES.STUDENT,
    passwordHash: DEFAULT_PASSWORD,
  },
  {
    name: 'Tiago Souza',
    username: 'tiago_souza',
    role: ROLES.STUDENT,
    passwordHash: DEFAULT_PASSWORD,
  },
  {
    name: 'Larissa Ferreira',
    username: 'lari_ferreira',
    role: ROLES.STUDENT,
    passwordHash: DEFAULT_PASSWORD,
  },
  {
    name: 'Enzo Gabriel',
    username: 'enzo_estudos',
    role: ROLES.STUDENT,
    passwordHash: DEFAULT_PASSWORD,
  },
];

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.user.deleteMany();

  console.log('Semeando novos usuários...');

  await prisma.user.createMany({ data: USERS_DATA });

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