import {
  ExecSyncOptions,
  ExecSyncOptionsWithStringEncoding,
  execSync,
  spawnSync,
} from 'child_process';
import * as fs from 'fs';
import * as readline from 'readline';

interface PackageJson {
  version: string;
  [key: string]: unknown;
}

type BumpType = 'patch' | 'minor' | 'major' | string;

const DRY_RUN = process.argv.includes('--dry-run');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

const logDryRun = (message: string) => {
  if (DRY_RUN) console.log(`${COLORS.gray}[dry-run] ${message}${COLORS.reset}`);
};

const executeShell = (command: string): void => {
  if (DRY_RUN) {
    logDryRun(`$ ${command}`);
    return;
  }
  execSync(command, {
    stdio: 'inherit',
    shell: true,
  } as unknown as ExecSyncOptions);
};

const executeSilent = (command: string): string => {
  return execSync(command, {
    encoding: 'utf8',
    shell: true,
  } as unknown as ExecSyncOptionsWithStringEncoding).trim();
};

const executeGit = (args: string[]): void => {
  if (DRY_RUN) {
    logDryRun(`git ${args.join(' ')}`);
    return;
  }
  const result = spawnSync('git', args, { stdio: 'inherit', shell: false });
  if (result.status !== 0) {
    throw new Error(`git ${args[0]} falhou com código ${result.status}`);
  }
};
