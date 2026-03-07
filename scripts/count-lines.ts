import { execSync } from 'child_process';
import os from 'os';

const isWindows = os.platform() === 'win32';

// Regex para filtrar extensões de código
const fileExtensions = '\\.(ts|tsx|js|jsx|css|scss)$';

// Comandos para Windows (PowerShell)
const winCountFiles = '(git ls-files).Count';
const winCountLines = `git ls-files | Where-Object { $_ -match '${fileExtensions}' } | ForEach-Object { Get-Content -LiteralPath $_ } | Measure-Object -Line`;

// Comandos para Linux/Mac (Bash)
const unixCountFiles = 'git ls-files | wc -l';
const unixCountLines = `git ls-files | grep -E '${fileExtensions}' | xargs wc -l | tail -1`;

try {
  const cmdFiles = isWindows
    ? `powershell -Command "${winCountFiles}"`
    : unixCountFiles;
  const cmdLines = isWindows
    ? `powershell -Command "${winCountLines}"`
    : unixCountLines;

  const totalFiles = execSync(cmdFiles).toString().trim();
  const lineOutput = execSync(cmdLines).toString().trim();

  // No Linux, o wc -l retorna algo como "10296 total", pegamos só o número
  const totalLines = isWindows
    ? lineOutput.split('\n')[2]?.trim() || lineOutput
    : lineOutput.split(' ')[0];

  const media = (Number(totalLines) / Number(totalFiles)).toFixed(2);

  console.log('\n📊 ESTATÍSTICAS DO PROJETO');
  console.log('--------------------------');
  console.log(`📂 Total de arquivos (Git): ${totalFiles}`);
  console.log(`💻 Linhas de código puro:   ${totalLines}`);
  console.log(`📈 Média por arquivo:       ${media} linhas`);
  console.log('--------------------------\n');
} catch (error) {
  if (error instanceof Error) {
    console.error('Erro ao executar o script:', error.message);
  } else {
    console.error('Erro ao executar o script:', error);
  }
}
