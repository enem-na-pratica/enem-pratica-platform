import { execSync } from 'child_process';
import os from 'os';

interface ProjectStats {
  totalFiles: number;
  totalLines: number;
  averageLinesPerFile: string;
}

const FILE_EXTENSIONS_PATTERN: string = '\\.(ts|tsx|js|jsx|css|scss)$';
const IS_WINDOWS: boolean = os.platform() === 'win32';

class CommandFactory {
  static getFilesCountCommand(): string {
    return IS_WINDOWS
      ? 'powershell -Command "(git ls-files).Count"'
      : 'git ls-files | wc -l';
  }

  static getLinesCountCommand(): string {
    return IS_WINDOWS
      ? `powershell -Command "git ls-files | Where-Object { $_ -match '${FILE_EXTENSIONS_PATTERN}' } | ForEach-Object { Get-Content -LiteralPath $_ } | Measure-Object -Line"`
      : `git ls-files | grep -E '${FILE_EXTENSIONS_PATTERN}' | xargs wc -l | tail -1`;
  }
}

const parseTotalLines = (output: string): number => {
  const cleanedOutput = output.trim();
  if (IS_WINDOWS) {
    return parseInt(cleanedOutput.split('\n')[2]?.trim() || cleanedOutput, 10);
  }
  return parseInt(cleanedOutput.split(' ')[0], 10);
};

const runCommand = (command: string): string => {
  return execSync(command).toString().trim();
};

function calculateProjectStats(): void {
  try {
    const totalFiles = Number(
      runCommand(CommandFactory.getFilesCountCommand()),
    );
    const lineOutput = runCommand(CommandFactory.getLinesCountCommand());
    const totalLines = parseTotalLines(lineOutput);

    const stats: ProjectStats = {
      totalFiles,
      totalLines,
      averageLinesPerFile: (totalLines / totalFiles).toFixed(2),
    };

    printReport(stats);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao processar estatísticas:', errorMessage);
  }
}

function printReport(stats: ProjectStats): void {
  const { totalFiles, totalLines, averageLinesPerFile } = stats;

  console.log('\n📊 ESTATÍSTICAS DO PROJETO');
  console.log('--------------------------');
  console.log(`📂 Total de arquivos (Git): ${totalFiles}`);
  console.log(`💻 Linhas de código puro:   ${totalLines}`);
  console.log(`📈 Média por arquivo:       ${averageLinesPerFile} linhas`);
  console.log('--------------------------\n');
}

calculateProjectStats();
