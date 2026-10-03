import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { preview } from '../frontend/node_modules/vite/dist/node/index.js';
import { command } from './commands.mjs';
import { root, runtime, prepareRuntime } from './paths.mjs';
import { preflight } from './preflight.mjs';
import { freePort, startFixture, waitForFixture, stopFixture } from './e2e-support.mjs';

async function frontendPreview(backendUrl) {
  process.env.WM_BACKEND_URL = backendUrl;
  const port = await freePort();
  const server = await preview({
    root: join(root, 'frontend'),
    preview: { host: '127.0.0.1', port, strictPort: true, proxy: { '/api': backendUrl } },
  });
  return { server, url: `http://127.0.0.1:${port}` };
}
async function browserTests(directory, url) {
  await command(
    process.execPath,
    [
      join(root, 'node_modules/@playwright/test/cli.js'),
      'test',
      '--config',
      'e2e/playwright.config.ts',
    ],
    {
      env: { ...process.env, WM_E2E_BASE_URL: url, WM_E2E_FIXTURE_DIR: directory },
      timeout: 180000,
    },
  );
}
async function cleanup(directory, fixture, frontend, ready, failure) {
  if (frontend) await new Promise((resolve) => frontend.server.httpServer.close(resolve));
  const removedContainerIds = await stopFixture(directory, fixture);
  await writeFile(
    join(directory, 'result.json'),
    JSON.stringify(
      {
        success: !failure,
        fixture: ready ?? null,
        cleanup: 'completed',
        removedContainerIds,
        error: failure?.message ?? null,
      },
      null,
      2,
    ),
  );
  console.log(`E2E evidence ${directory}/result.json`);
}
async function run() {
  await prepareRuntime();
  await preflight();
  await command('npm', ['run', 'build', '--workspace', 'frontend'], { timeout: 120000 });
  const directory = join(runtime, 'e2e', randomUUID());
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const fixture = await startFixture(directory, await freePort());
  let frontend;
  let ready;
  let failure;
  try {
    ready = await waitForFixture(directory, fixture);
    frontend = await frontendPreview(ready.backendUrl);
    await browserTests(directory, frontend.url);
  } catch (error) {
    failure = error;
  } finally {
    await cleanup(directory, fixture, frontend, ready, failure);
  }
  if (failure) throw failure;
}
await run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
