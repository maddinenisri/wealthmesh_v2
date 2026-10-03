import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { scenarioInventory, identityDiagnostics } from './requirements.mjs';

const snapshot = new URL('../requirements/snapshots/2026-10-03-v2/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('manifest.json', snapshot), 'utf8'));
const inventory = JSON.parse(await readFile(new URL('scenario-inventory.json', snapshot), 'utf8'));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('every immutable captured file retains its exact recorded bytes and SHA-256', async () => {
  for (const file of manifest.files) {
    const bytes = await readFile(new URL(`source/${file.path}`, snapshot));
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(sha256(bytes), file.sha256, file.path);
  }
  const aggregate = manifest.files.map((file) => `${file.sha256}  ${file.path}\n`).join('');
  assert.equal(sha256(aggregate), manifest.sourceAggregateSha256);
});

test('scenario inventory reconciles captured feature source, lines, tags and identity diagnostics', async () => {
  const files = manifest.files.filter((file) => file.path.endsWith('.feature'));
  const scenarios = (
    await Promise.all(
      files.map(async (file) =>
        scenarioInventory(
          await readFile(new URL(`source/${file.path}`, snapshot), 'utf8'),
          file.path,
        ),
      ),
    )
  ).flat();
  assert.equal(files.length, manifest.featureCount);
  assert.equal(scenarios.length, manifest.scenarioCount);
  assert.deepEqual(identityDiagnostics(scenarios), manifest.diagnostics);
  assert.deepEqual(
    inventory.map(({ releaseStatus, reason, ...scenario }) => {
      assert.equal(releaseStatus, 'deferred');
      assert.match(reason, /Q-004/);
      return scenario;
    }),
    scenarios,
  );
});
