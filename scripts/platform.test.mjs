import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { root } from './paths.mjs';
import { validatePort, assertPortFree, isOwnedProcess } from './processes.mjs';

async function prerequisiteFixture(check) {
  const directory = await mkdtemp(join(tmpdir(), 'wealthmesh-prerequisites-'));
  try {
    await check(directory);
  } finally {
    await rm(directory, { recursive: true });
  }
}
async function fixtureTool(directory, name, body) {
  await writeFile(join(directory, name), `#!/bin/sh\n${body}\n`, { mode: 0o700 });
}
function prerequisiteEntry(directory) {
  return spawnSync('/bin/sh', [join(root, 'scripts/preflight.sh')], {
    cwd: directory,
    env: { ...process.env, PATH: directory },
    encoding: 'utf8',
    timeout: 3000,
  });
}

test('prerequisite entry names the pinned Node correction when PATH has no Node or npm', async () => {
  await prerequisiteFixture(async (directory) => {
    const result = prerequisiteEntry(directory);
    assert.equal(result.error, undefined);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Node\.js 26\.4\.0.*not.*PATH/);
    assert.match(result.stderr, /Install or select Node\.js 26\.4\.0/);
    assert.match(result.stderr, /\/bin\/sh scripts\/preflight\.sh/);
  });
});

test('prerequisite entry names the pinned npm correction when only Node is present', async () => {
  await prerequisiteFixture(async (directory) => {
    await fixtureTool(directory, 'node', 'exit 97');
    const result = prerequisiteEntry(directory);
    assert.equal(result.error, undefined);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /npm 11\.17\.0.*not.*PATH/);
    assert.match(result.stderr, /Install or select npm 11\.17\.0/);
  });
});

test('prerequisite entry delegates the established npm check from project root and preserves failure', async () => {
  await prerequisiteFixture(async (directory) => {
    await fixtureTool(directory, 'node', 'exit 97');
    await fixtureTool(
      directory,
      'npm',
      'printf "%s\\n" "$PWD" "$@" > "$(command -v npm).capture"\nexit 23',
    );
    const result = prerequisiteEntry(directory);
    assert.equal(result.error, undefined);
    assert.equal(result.status, 23);
    assert.equal(
      await readFile(join(directory, 'npm.capture'), 'utf8'),
      `${resolve(root)}\nrun\npreflight\n`,
    );
  });
});

test('rejects invalid or privileged port overrides', () => {
  for (const input of ['0', '-2', 'hello', '80', '65536', '5173.5']) {
    assert.throws(() => validatePort(input, 'frontend'), /port/i);
  }
  assert.equal(validatePort('5173', 'frontend'), 5173);
});

test('does not claim a PID belonging to an unrelated process', async () => {
  assert.equal(
    await isOwnedProcess({ pid: process.pid, token: 'not-my-token', started: 'unknown' }),
    false,
  );
});

test('reports an unrelated listener conflict and leaves it listening', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    assert.equal(typeof address, 'object');
    await assert.rejects(assertPortFree(address.port, 'frontend'), /already in use/);
    assert.equal(server.listening, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('Java launcher removes independent Spring and JVM overrides before owned configuration', async () => {
  const { sanitizeJavaEnvironment } = await import('./java-environment.mjs');
  const result = sanitizeJavaEnvironment({
    PATH: '/synthetic/bin',
    SPRING_DATASOURCE_URL: 'stale',
    SPRING_FLYWAY_URL: 'outside-fixture',
    SERVER_ADDRESS: '0.0.0.0',
    SPRING_CONFIG_IMPORT: 'optional:file:/outside',
    SPRING_APPLICATION_JSON: '{}',
    JAVA_TOOL_OPTIONS: '-Dserver.address=0.0.0.0',
    JDK_JAVA_OPTIONS: '-Dspring.flyway.url=outside',
    _JAVA_OPTIONS: 'unsafe',
    GRADLE_OPTS: '-Dspring.config.location=outside',
  });
  assert.deepEqual(result, { PATH: '/synthetic/bin' });
});

test('frontend reader rejects private-directory canaries and still serves ordinary source modules', async () => {
  const { createServer } = await import('../frontend/node_modules/vite/dist/node/index.js');
  const { root, runtime, prepareRuntime } = await import('./paths.mjs');
  const { join } = await import('node:path');
  const { writeFile, unlink } = await import('node:fs/promises');
  await prepareRuntime();
  const canary = join(runtime, `frontend-canary-${process.pid}.txt`);
  await writeFile(canary, 'SYNTHETIC_PRIVATE_DIRECTORY_PROBE');
  const vite = await createServer({
    root: join(root, 'frontend'),
    server: { host: '127.0.0.1', port: 0, strictPort: true },
  });
  try {
    await vite.listen();
    const origin = vite.resolvedUrls.local[0];
    const privateResponse = await fetch(`${origin}@fs${canary}`);
    assert.ok([403, 404].includes(privateResponse.status));
    const mainResponse = await fetch(`${origin}src/main.tsx`);
    assert.equal(mainResponse.status, 200);
    assert.match(await mainResponse.text(), /createRoot/);
  } finally {
    await vite.close();
    await unlink(canary);
  }
});

test('E2E explicitly starts setup then finance in distinct sequential lifecycles', async () => {
  const { runSequentialSuites } = await import('./e2e-support.mjs');
  const stages = [];
  await runSequentialSuites(['setup.spec.ts', 'finance.spec.ts'], async (suite) => {
    stages.push('start:' + suite);
    await Promise.resolve();
    stages.push('cleanup:' + suite);
  });
  assert.deepEqual(stages, [
    'start:setup.spec.ts',
    'cleanup:setup.spec.ts',
    'start:finance.spec.ts',
    'cleanup:finance.spec.ts',
  ]);
});

test('E2E propagates failure and leaves later suites unexecuted', async () => {
  const { runSequentialSuites } = await import('./e2e-support.mjs');
  const started = [];
  await assert.rejects(
    runSequentialSuites(['setup.spec.ts', 'finance.spec.ts'], async (suite) => {
      started.push(suite);
      throw new Error('controlled suite failure');
    }),
    /controlled suite failure/,
  );
  assert.deepEqual(started, ['setup.spec.ts']);
});

test('owned E2E preview keeps deep-route HTML and assets when its source output disappears or changes', async () => {
  const { frontendPreview } = await import('./e2e-support.mjs');
  const { mkdtemp, mkdir, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const temporary = await mkdtemp(join(tmpdir(), 'wealthmesh-preview-isolation-'));
  const source = join(temporary, 'source');
  const fixture = join(temporary, 'fixture');
  let frontend;
  try {
    await mkdir(source);
    await mkdir(fixture);
    await writeFile(
      join(source, 'index.html'),
      '<html><body>INITIAL_SYNTHETIC_SHELL</body></html>',
    );
    await writeFile(join(source, 'asset.js'), 'INITIAL_SYNTHETIC_ASSET');
    frontend = await frontendPreview(fixture, 'http://127.0.0.1:1', source);
    assert.equal(frontend.server.config.build.outDir, join(fixture, 'frontend'));
    await assertPreviewFiles(frontend.url);
    await rm(source, { recursive: true });
    await assertPreviewFiles(frontend.url);
    await mkdir(source);
    await writeFile(join(source, 'index.html'), 'REPLACEMENT_OUTPUT');
    await writeFile(join(source, 'asset.js'), 'REPLACEMENT_ASSET');
    await assertPreviewFiles(frontend.url);
  } finally {
    if (frontend) await frontend.server.close();
    await rm(temporary, { recursive: true, force: true });
  }
});

async function assertPreviewFiles(origin) {
  const response = await fetch(origin + '/accounts/new/checking', {
    headers: { Accept: 'text/html' },
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /INITIAL_SYNTHETIC_SHELL/);
  const asset = await fetch(origin + '/asset.js');
  assert.equal(asset.status, 200);
  assert.equal(await asset.text(), 'INITIAL_SYNTHETIC_ASSET');
}
