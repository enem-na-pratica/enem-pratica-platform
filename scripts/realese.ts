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

const getPackageData = (): PackageJson => {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

const isValidSemver = (version: string): boolean =>
  /^\d+\.\d+\.\d+([-.][a-zA-Z0-9.]+)?$/.test(version);

const calculateSimulatedVersion = (
  currentVersion: string,
  bumpType: string,
): string => {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  const strategies: Record<string, string> = {
    patch: `${major}.${minor}.${patch + 1}`,
    minor: `${major}.${minor + 1}.0`,
    major: `${major + 1}.0.0`,
  };
  return strategies[bumpType] ?? bumpType;
};

async function promptBumpType(): Promise<BumpType> {
  console.log('\nQual o tipo de atualização?');
  console.log('1) patch\n2) minor\n3) major\n4) manual');

  const choice = (await ask('Escolha (1-4): ')).trim();

  switch (choice) {
    case '1':
      return 'patch';
    case '2':
      return 'minor';
    case '3':
      return 'major';
    case '4':
      const manualVersion = (
        await ask('Digite a nova versão (ex: 0.17.0): ')
      ).trim();
      if (!isValidSemver(manualVersion))
        throw new Error('Versão inválida. Use o formato semver.');
      return manualVersion;
    default:
      throw new Error('Opção inválida.');
  }
}

async function performVersionBump(bumpType: BumpType): Promise<string> {
  const pkg = getPackageData();

  if (DRY_RUN) {
    const newVersion = calculateSimulatedVersion(pkg.version, bumpType);
    logDryRun(`npm version ${bumpType} --no-git-tag-version`);
    return newVersion;
  }

  executeSilent(`npm version ${bumpType} --no-git-tag-version`);
  return getPackageData().version;
}

async function main(): Promise<void> {
  try {
    if (DRY_RUN) {
      console.log(
        `${COLORS.yellow}⚠ Modo dry-run ativo — nenhum comando Git será executado.${COLORS.reset}`,
      );
    }

    const initialPkg = getPackageData();
    console.log(
      `\nVersão atual: ${COLORS.yellow}${initialPkg.version}${COLORS.reset}`,
    );

    const bumpType = await promptBumpType();
    const newVersion = await performVersionBump(bumpType);

    console.log(
      `${COLORS.green}Próxima versão:${COLORS.reset} ${COLORS.yellow}${newVersion}${COLORS.reset}\n`,
    );

    console.log(`${COLORS.cyan}--- Configuração da Tag ---${COLORS.reset}`);
    const tagDesc = await ask(
      `Padrão: Version ${newVersion}: [DESCRIÇÃO]\nDigite a descrição: `,
    );

    const defaultCommit = `chore: bump version to ${newVersion}`;
    const commitInput = await ask(
      `\n${COLORS.cyan}--- Configuração do Commit ---${COLORS.reset}\nMensagem [${defaultCommit}]: `,
    );
    const commitMsg = commitInput.trim() || defaultCommit;

    console.log(`\n${COLORS.yellow}Executando comandos Git...${COLORS.reset}`);
    executeShell('git add -u');
    executeGit(['commit', '-m', commitMsg]);
    executeGit([
      'tag',
      '-a',
      `v${newVersion}`,
      '-m',
      `Version ${newVersion}: ${tagDesc}`,
    ]);

    console.log(`\n${COLORS.green}✔ Sucesso!${COLORS.reset}`);
    console.log(`Commit: ${COLORS.cyan}${commitMsg}${COLORS.reset}`);
    console.log(
      `Tag:    ${COLORS.cyan}v${newVersion} - Version ${newVersion}: ${tagDesc}${COLORS.reset}`,
    );

    const pushNow = await ask('\nDeseja dar push agora? (s/n): ');
    if (pushNow.trim().toLowerCase() === 's') {
      const currentBranch = executeSilent('git rev-parse --abbrev-ref HEAD');
      executeGit(['push', 'origin', currentBranch]);
      executeGit(['push', 'origin', `v${newVersion}`]);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `\n${COLORS.red}Erro durante a execução:${COLORS.reset}`,
      message,
    );
  } finally {
    rl.close();
  }
}

main();
