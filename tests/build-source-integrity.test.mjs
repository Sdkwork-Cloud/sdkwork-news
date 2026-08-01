import assert from 'node:assert/strict';
import test from 'node:test';

import { ensureTrackedBuildSources } from '../tools/build-source-integrity.mjs';

const regularFile = {
  isFile: () => true,
  isSymbolicLink: () => false,
};

test('restores a missing tracked build source before continuing', () => {
  let exists = false;
  const calls = [];

  ensureTrackedBuildSources({
    repoRoot: 'C:/workspace/news',
    relativePaths: ['apps/news/src/main.tsx'],
    fileExists: () => exists,
    inspectFile: () => regularFile,
    runProcess(command, args) {
      calls.push([command, ...args]);
      if (args[0] === 'checkout') {
        exists = true;
      }
      return { status: 0, stdout: 'apps/news/src/main.tsx\n', stderr: '' };
    },
  });

  assert.deepEqual(calls, [
    ['git', 'ls-files', '--error-unmatch', '--', 'apps/news/src/main.tsx'],
    ['git', 'checkout', 'HEAD', '--', 'apps/news/src/main.tsx'],
  ]);
});

test('rejects build-source paths outside the repository', () => {
  assert.throws(
    () => ensureTrackedBuildSources({
      repoRoot: 'C:/workspace/news',
      relativePaths: ['../outside.ts'],
      fileExists: () => false,
    }),
    /escapes the repository/u,
  );
});

test('reports the exact recovery command for an untracked missing source', () => {
  assert.throws(
    () => ensureTrackedBuildSources({
      repoRoot: 'C:/workspace/news',
      relativePaths: ['apps/news/vite.config.ts'],
      fileExists: () => false,
      runProcess: () => ({ status: 1, stdout: '', stderr: '' }),
    }),
    /git checkout HEAD -- apps\/news\/vite\.config\.ts/u,
  );
});
