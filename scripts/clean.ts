import { execSync } from 'node:child_process';
import os from 'node:os';

const CACHE_PATHS: string[] = ['.next', 'node_modules/.cache', 'dist'];
const IS_WINDOWS: boolean = os.platform() === 'win32';

function getWindowsCleanupCommand(paths: string[]): string {
  const commands = paths.map(
    (path) => `if (Test-Path ${path}) { Remove-Item -Recurse -Force ${path} }`,
  );
  return `powershell -Command "${commands.join('; ')}"`;
}

function getUnixCleanupCommand(paths: string[]): string {
  return `rm -rf ${paths.join(' ')}`;
}

function getCleanupCommand(): string {
  return IS_WINDOWS
    ? getWindowsCleanupCommand(CACHE_PATHS)
    : getUnixCleanupCommand(CACHE_PATHS);
}

function cleanProject(): void {
  try {
    console.log('🧹 Limpando caches e builds antigos...');

    execSync(getCleanupCommand(), { stdio: 'inherit' });

    console.log('✨ Projeto limpo!');
    console.log('💡 Rode "npm run dev" para recriar o cache necessário.');
  } catch {
    console.error('\n❌ Erro ao tentar limpar o projeto.');
    process.exit(1);
  }
}

cleanProject();
