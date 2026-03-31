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
