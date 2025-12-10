import { prisma } from './prisma';

// 0123456789
const DEFAULT_PASSWORD = "$2b$12$8QHdhZ8bP4tLH.ZjaOKNpuCQUt5plrgKfbCUKEGX1Gc2hDmSGewkC";

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: 'Alice da Silva',
      username: 'alice_admin',
      passwordHash: DEFAULT_PASSWORD,
      role: 'ADMIN',
    },
  });
  console.log('Created user:', newUser);

  const anotherUser = await prisma.user.create({
    data: {
      name: 'Bob o Estudante',
      username: 'bob_student',
      passwordHash: DEFAULT_PASSWORD,
      role: 'STUDENT',
    },
  });
  console.log('Created another user:', anotherUser);


  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
    }
  });

  console.log('All users:', JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Database connection disconnected.')
  })
  .catch(async (e) => {
    console.error('An error occurred:', e)
    await prisma.$disconnect()
    process.exit(1)
  })