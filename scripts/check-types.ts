import { execSync } from 'node:child_process';

interface ValidationStep {
  label: string;
  command: string;
}

const VALIDATION_STEPS: ValidationStep[] = [
  {
    label: '🔍 Verificando tipos do TypeScript...',
    command: 'npx tsc --noEmit',
  },
  {
    label: '🗄️ Verificando esquema do Prisma...',
    command: 'npx prisma validate',
  },
];

function runStep(step: ValidationStep): void {
  console.log(step.label);
  execSync(step.command, { stdio: 'inherit' });
}

function validateProject(): void {
  try {
    VALIDATION_STEPS.forEach(runStep);
    console.log('✅ Tudo certo para o commit!');
  } catch {
    console.error('\n❌ Ops! Corrija os erros acima antes de prosseguir.');
    process.exit(1);
  }
}

validateProject();
