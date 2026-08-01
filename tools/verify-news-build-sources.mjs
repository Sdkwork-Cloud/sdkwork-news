#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureTrackedBuildSources } from './build-source-integrity.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMMON_SOURCES = [
  'package.json',
  'pnpm-workspace.yaml',
];
const SOURCE_GROUPS = {
  pc: [
    'apps/sdkwork-news-pc/package.json',
    'apps/sdkwork-news-pc/tsconfig.json',
    'apps/sdkwork-news-pc/vite.config.ts',
    'apps/sdkwork-news-pc/index.html',
    'apps/sdkwork-news-pc/src/main.tsx',
  ],
  h5: [
    'apps/sdkwork-news-h5/package.json',
    'apps/sdkwork-news-h5/tsconfig.json',
    'apps/sdkwork-news-h5/vite.config.ts',
    'apps/sdkwork-news-h5/index.html',
    'apps/sdkwork-news-h5/src/main.tsx',
  ],
  flutter: [
    'apps/sdkwork-news-flutter-mobile/pubspec.yaml',
    'apps/sdkwork-news-flutter-mobile/pubspec.lock',
    'apps/sdkwork-news-flutter-mobile/sdkwork.app.config.json',
    'apps/sdkwork-news-flutter-mobile/config/app/runtime-env.development.example.json',
    'apps/sdkwork-news-flutter-mobile/lib/main.dart',
    'apps/sdkwork-news-flutter-mobile/lib/bootstrap/runtime.dart',
    'apps/sdkwork-news-flutter-mobile/tool/generate_i18n.dart',
  ],
  rust: [
    'Cargo.toml',
    'Cargo.lock',
    'tools/run-news-cargo.mjs',
  ],
};

const scopeIndex = process.argv.indexOf('--scope');
const requestedScope = scopeIndex >= 0 ? process.argv[scopeIndex + 1] : 'all';
const selectedGroups = requestedScope === 'all'
  ? Object.keys(SOURCE_GROUPS)
  : [requestedScope];

for (const scope of selectedGroups) {
  if (!(scope in SOURCE_GROUPS)) {
    throw new Error(
      `unknown build-source scope ${scope}; expected one of ${Object.keys(SOURCE_GROUPS).join(', ')}, all`,
    );
  }
}

ensureTrackedBuildSources({
  repoRoot: REPO_ROOT,
  relativePaths: [
    ...COMMON_SOURCES,
    ...selectedGroups.flatMap((scope) => SOURCE_GROUPS[scope]),
  ],
});

console.log(`[sdkwork-news] ${requestedScope} build-critical sources verified`);
