import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { resolveCargoExecutable } from '../tools/run-news-cargo.mjs';

test('uses an explicitly configured Cargo executable', () => {
  const executable = resolveCargoExecutable({
    environment: { CARGO: 'D:/toolchains/rust/cargo.exe' },
    fileExists: () => false,
    homeDirectory: 'C:/Users/tester',
    platform: 'win32',
  });

  assert.equal(executable, 'D:/toolchains/rust/cargo.exe');
});

test('finds the standard rustup Cargo executable outside PATH on Windows', () => {
  const homeDirectory = 'C:/Users/tester';
  const expected = path.join(homeDirectory, '.cargo', 'bin', 'cargo.exe');
  const executable = resolveCargoExecutable({
    environment: {},
    fileExists: (candidate) => candidate === expected,
    homeDirectory,
    platform: 'win32',
  });

  assert.equal(executable, expected);
});

test('falls back to the platform Cargo command when rustup is unavailable', () => {
  const executable = resolveCargoExecutable({
    environment: {},
    fileExists: () => false,
    homeDirectory: '/home/tester',
    platform: 'linux',
  });

  assert.equal(executable, 'cargo');
});
