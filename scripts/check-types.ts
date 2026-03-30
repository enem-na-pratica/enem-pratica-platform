import { execSync } from 'node:child_process';

try {
  console.log('🔍 Verificando tipos do TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });

  console.log('🗄️ Verificando esquema do Prisma...');
  execSync('npx prisma validate', { stdio: 'inherit' });

  console.log('✅ Tudo certo para o commit!');
} catch {
  console.error('\n❌ Ops! Corrija os erros acima antes de prosseguir.');
  process.exit(1);
}
