import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { scenarioInventory, identityDiagnostics } from './requirements.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const sourceRoot = resolve(root, '../wealthmesh/docs/requirements/v2');
const destination = resolve(root, 'docs/requirements/snapshots/2026-10-03-v2');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const git = (...args) =>
  execFileSync('git', ['-C', resolve(root, '../wealthmesh'), ...args], { encoding: 'utf8' }).trim();
const scopedStatus = () =>
  git('status', '--porcelain=v1', '--untracked-files=all', '--', 'docs/requirements/v2');

async function textFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink())
      throw new Error('Requirement symlinks are not permitted in a text-only capture.');
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) paths.push(...(await textFiles(path)));
    else if (['.md', '.feature', '.txt'].includes(extname(entry.name))) paths.push(path);
    else throw new Error(`Unexpected nontext requirement file: ${relative(sourceRoot, path)}`);
  }
  return paths.sort();
}

async function readSource() {
  const files = await textFiles(sourceRoot);
  return Promise.all(
    files.map(async (path) => {
      const bytes = await readFile(path);
      new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      return { path: relative(sourceRoot, path), bytes, sha256: sha256(bytes) };
    }),
  );
}

async function copySource(files) {
  for (const file of files) {
    const target = resolve(destination, 'source', file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.bytes, { flag: 'wx' });
  }
}

function inventoryMarkdown(files, scenarios, diagnostics, metadata) {
  const heading = '# Captured v2 requirements inventory\n\n';
  const summary = `Snapshot: \`2026-10-03-v2\`. Captured ${metadata.captureStartedUtc} through ${metadata.captureFinishedUtc}. ${files.length} text files include ${metadata.featureCount} feature files and ${scenarios.length} scenarios/outlines with ${diagnostics.uniqueIds} unique scenario IDs. Outlines count once; example rows are not additional scenario IDs.\n\nNo finance scenario is included or implemented by SETUP-001. Every scenario is **deferred for release selection**, because [Q-004](../questions.md#q-004-first-usable-finance-release) remains open. These are source requirements, not accepted product behavior.\n\n`;
  const integrity = `## Capture integrity\n\nSource revision: \`${metadata.sourceRevision}\`. All captured source files are untracked in the sibling repository; the revision alone does not identify them. Per-file bytes, SHA-256, scoped status and full tags are retained in copyable local paths \`docs/requirements/snapshots/2026-10-03-v2/manifest.json\` and \`scenario-inventory.json\`. Source aggregate SHA-256: \`${metadata.sourceAggregateSha256}\`.\n\nMissing IDs: **${diagnostics.missingIds.length}**. Duplicate IDs: **${diagnostics.duplicates.length}**. Multiple IDs on one scenario: **${diagnostics.multipleIds.length}**. Source names/tags are preserved; the sibling README count is historical source text, not the captured count.\n\n`;
  const featureTable =
    '## Feature files\n\n| Captured source path | Scenarios/outlines | Release status |\n| --- | --- | --- |\n' +
    files
      .filter((file) => file.path.endsWith('.feature'))
      .map(
        (file) =>
          `| \`${file.path}\` | ${scenarios.filter((scenario) => scenario.file === file.path).length} | Deferred: Q-004 |`,
      )
      .join('\n') +
    '\n\n';
  const table =
    '## Scenario traceability\n\nPaths below are relative to the immutable snapshot source directory `docs/requirements/snapshots/2026-10-03-v2/source/`; the number after the colon is the original source line. Full scenario names and all tags are also in `scenario-inventory.json`.\n\n| Scenario ID | Original source path and line | Release status and reason |\n| --- | --- | --- |\n' +
    scenarios
      .map(
        (scenario) =>
          `| ${scenario.ids.map((id) => `\`${id}\``).join(', ') || 'Missing ID'} | \`${scenario.file}:${scenario.line}\` | Deferred: Q-004 release selection pending; no finance behavior in setup |`,
      )
      .join('\n') +
    '\n';
  return heading + summary + integrity + featureTable + table;
}

async function verifyStableSource(files, sourceStatusBefore) {
  const current = await readSource();
  const sourceStatusAfter = scopedStatus();
  if (
    sourceStatusAfter !== sourceStatusBefore ||
    current.some(
      (file, index) => file.path !== files[index]?.path || file.sha256 !== files[index]?.sha256,
    ) ||
    current.length !== files.length
  )
    throw new Error('Requirements changed during capture; capture aborted.');
  return sourceStatusAfter;
}

function captureMetadata(files, scenarios, source) {
  return {
    ...source,
    captureFinishedUtc: new Date().toISOString(),
    sourcePath: sourceRoot,
    sourceDirty: Boolean(source.sourceStatusBefore),
    featureCount: files.filter((file) => file.path.endsWith('.feature')).length,
    scenarioCount: scenarios.length,
    sourceAggregateSha256: sha256(files.map((file) => `${file.sha256}  ${file.path}\n`).join('')),
    files: files.map(({ path, bytes, sha256: checksum }) => ({
      path,
      bytes: bytes.length,
      sha256: checksum,
    })),
    diagnostics: identityDiagnostics(scenarios),
  };
}

async function writeCaptureArtifacts(files, scenarios, metadata) {
  await writeFile(resolve(destination, 'manifest.json'), JSON.stringify(metadata, null, 2) + '\n', {
    flag: 'wx',
  });
  await writeFile(
    resolve(destination, 'scenario-inventory.json'),
    JSON.stringify(
      scenarios.map((scenario) => ({
        ...scenario,
        releaseStatus: 'deferred',
        reason: 'Q-004 release selection pending; SETUP-001 implements no finance scenario',
      })),
      null,
      2,
    ) + '\n',
    { flag: 'wx' },
  );
  await writeFile(
    resolve(root, 'docs/requirements/inventory.md'),
    inventoryMarkdown(files, scenarios, metadata.diagnostics, metadata),
    { flag: 'wx' },
  );
}

async function capture() {
  const captureStartedUtc = new Date().toISOString();
  const sourceRevision = git('rev-parse', 'HEAD');
  const sourceStatusBefore = scopedStatus();
  const files = await readSource();
  const scenarios = files
    .filter((file) => file.path.endsWith('.feature'))
    .flatMap((file) => scenarioInventory(file.bytes.toString('utf8'), file.path));
  const sourceStatusAfter = await verifyStableSource(files, sourceStatusBefore);
  await mkdir(destination, { recursive: false });
  await copySource(files);
  const metadata = captureMetadata(files, scenarios, {
    captureStartedUtc,
    sourceRevision,
    sourceStatusBefore,
    sourceStatusAfter,
  });
  await writeCaptureArtifacts(files, scenarios, metadata);
  console.log(
    `Captured ${metadata.featureCount} feature files, ${scenarios.length} scenarios/outlines, ${metadata.diagnostics.uniqueIds} unique IDs. Immutable source SHA-256: ${metadata.sourceAggregateSha256}`,
  );
}

await capture();
