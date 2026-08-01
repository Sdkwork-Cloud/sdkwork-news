#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureTrackedBuildSources } from './build-source-integrity.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allowedCommands = new Set(['build', 'clippy', 'fmt', 'test']);

export function resolveCargoExecutable({
  platform = process.platform,
  environment = process.env,
  homeDirectory = os.homedir(),
  fileExists = existsSync,
} = {}) {
  if (environment.CARGO) {
    return environment.CARGO;
  }

  const cargoHome = environment.CARGO_HOME || path.join(homeDirectory, '.cargo');
  const executableName = platform === 'win32' ? 'cargo.exe' : 'cargo';
  const rustupExecutable = path.join(cargoHome, 'bin', executableName);
  return fileExists(rustupExecutable) ? rustupExecutable : executableName;
}

export function runNewsCargo(args, options = {}) {
  if (args.length === 0 || !allowedCommands.has(args[0])) {
    throw new Error('expected an approved Cargo command: build, clippy, fmt, or test');
  }

  ensureTrackedBuildSources({
    repoRoot: REPO_ROOT,
    relativePaths: ['Cargo.toml', 'Cargo.lock', 'tools/run-news-cargo.mjs'],
  });

  const executable = resolveCargoExecutable(options);
  const result = spawnSync(executable, args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    windowsHide: true,
  });

  if (result.error) {
    const hint = process.platform === 'win32'
      ? 'Install Rust with rustup or set CARGO/CARGO_HOME to the Cargo installation.'
      : 'Install Rust with rustup or expose cargo on PATH.';
    throw new Error(`unable to run Cargo from ${executable}. ${hint}`, {
      cause: result.error,
    });
  }
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  runNewsCargo(process.argv.slice(2));
}
