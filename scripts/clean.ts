import { execSync } from 'node:child_process';
import os from 'node:os';

const isWindows = os.platform() === 'win32';

const paths = ['.next', 'node_modules/.cache', 'dist'];

const cmd = isWindows
  ? `powershell -Command "${paths.map((p) => `if (Test-Path ${p}) { Remove-Item -Recurse -Force ${p} }`).join('; ')}"`
  : `rm -rf ${paths.join(' ')}`;

try {
  console.log('🧹 Limpando caches e builds antigos...');
  execSync(cmd);
  console.log('✨ Projeto limpo!');
  console.log('💡 Rode "npm run dev" para recriar o cache necessário.');
} catch (error) {
  if (error instanceof Error) {
    console.error('Erro ao executar o script:', error.message);
  } else {
    console.error('Erro ao executar o script:', error);
  }
}
