#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FLUTTER_ROOT = path.join(REPO_ROOT, 'apps', 'sdkwork-news-flutter-mobile');
const args = process.argv.slice(2);
const allowedCommands = new Set(['analyze', 'build', 'test']);

if (args.length === 0 || !allowedCommands.has(args[0])) {
  throw new Error('expected an approved Flutter command: analyze, build, or test');
}

function run(executable, commandArgs) {
  const result = spawnSync(executable, commandArgs, {
    cwd: FLUTTER_ROOT,
    stdio: 'inherit',
    windowsHide: true,
    shell: process.platform === 'win32',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const dartExecutable = process.platform === 'win32' ? 'dart.bat' : 'dart';
run(dartExecutable, ['run', 'tool/generate_i18n.dart']);

const flutterExecutable = process.platform === 'win32' ? 'flutter.bat' : 'flutter';
run(flutterExecutable, args);
