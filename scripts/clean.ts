import { execSync } from 'node:child_process';
import os from 'node:os';

const isWindows = os.platform() === 'win32';

const paths = '.next node_modules/.cache dist';

const cmd = isWindows
  ? `powershell -Command "Remove-Item -Recurse -Force ${paths.split(' ').join(', ')} -ErrorAction SilentlyContinue"`
  : `rm -rf ${paths}`;

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
