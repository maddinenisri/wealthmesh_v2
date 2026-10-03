import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { root, runtime } from './paths.mjs';

const excluded = new Set(['build', '.gradle', 'node_modules', 'dist', 'cache']);
async function sourceFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !excluded.has(entry.name))
      .map(async (entry) => {
        const child = join(path, entry.name);
        if (entry.isDirectory()) return sourceFiles(child);
        return [child];
      }),
  );
  return nested.flat();
}
const directories = ['backend', 'frontend', 'scripts', 'e2e', 'config', 'docs/.vitepress'];
const rootFiles = [
  'package.json',
  'package-lock.json',
  'compose.yaml',
  'eslint.config.mjs',
  '.markdownlint.json',
  '.prettierrc.json',
  '.npmrc',
  '.node-version',
  '.gitignore',
];
const paths = [
  ...(await Promise.all(directories.map((path) => sourceFiles(join(root, path))))).flat(),
  ...rootFiles.map((path) => join(root, path)),
].sort();
const files = await Promise.all(
  paths.map(async (path) => ({
    path: relative(root, path),
    sha256: createHash('sha256')
      .update(await readFile(path))
      .digest('hex'),
  })),
);
const rows = files.map((file) => `${file.sha256}  ${file.path}\n`).join('');
const sha256 = createHash('sha256').update(rows).digest('hex');
await mkdir(join(runtime, 'evidence'), { recursive: true });
await writeFile(
  join(runtime, 'evidence/source-manifest.json'),
  JSON.stringify({ capturedAt: new Date().toISOString(), sha256, files }, null, 2),
);
console.log(`${files.length} executable/config source files; aggregate SHA-256 ${sha256}`);
