import { spawnSync } from 'node:child_process';
import { existsSync, lstatSync } from 'node:fs';
import path from 'node:path';

function defaultRunProcess(command, args, options) {
  return spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    stdio: 'pipe',
    windowsHide: true,
  });
}

function assertRegularFile(absolutePath, relativePath, inspectFile) {
  const metadata = inspectFile(absolutePath);
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    throw new Error(`build-critical source must be a regular file: ${relativePath}`);
  }
}

export function ensureTrackedBuildSources({
  repoRoot,
  relativePaths,
  fileExists = existsSync,
  inspectFile = lstatSync,
  runProcess = defaultRunProcess,
}) {
  const rootBoundary = path.resolve(repoRoot);

  for (const relativePath of [...new Set(relativePaths)].sort()) {
    const absolutePath = path.resolve(repoRoot, relativePath);
    if (
      absolutePath !== rootBoundary
      && !absolutePath.startsWith(`${rootBoundary}${path.sep}`)
    ) {
      throw new Error(`build-critical source escapes the repository: ${relativePath}`);
    }
    if (fileExists(absolutePath)) {
      assertRegularFile(absolutePath, relativePath, inspectFile);
      continue;
    }

    const recoveryCommand = `git checkout HEAD -- ${relativePath}`;
    const tracked = runProcess(
      'git',
      ['ls-files', '--error-unmatch', '--', relativePath],
      { cwd: repoRoot },
    );
    if (tracked.status !== 0) {
      throw new Error(
        `missing build-critical source ${relativePath}; recover it with: ${recoveryCommand}`,
      );
    }

    const recovered = runProcess(
      'git',
      ['checkout', 'HEAD', '--', relativePath],
      { cwd: repoRoot },
    );
    if (recovered.status !== 0 || !fileExists(absolutePath)) {
      throw new Error(
        `failed to recover build-critical source ${relativePath}; run: ${recoveryCommand}`,
      );
    }
    assertRegularFile(absolutePath, relativePath, inspectFile);
    console.log(`[sdkwork-news] recovered ${relativePath} from git`);
  }
}
