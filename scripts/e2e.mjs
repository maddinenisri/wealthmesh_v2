import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { command } from './commands.mjs';
import { root, runtime, prepareRuntime } from './paths.mjs';
import { preflight } from './preflight.mjs';
import {
  freePort,
  startFixture,
  waitForFixture,
  stopFixture,
  runSequentialSuites,
  frontendPreview,
} from './e2e-support.mjs';
async function browserTests(directory, url, suite) {
  await command(
    process.execPath,
    [
      join(root, 'node_modules/@playwright/test/cli.js'),
      'test',
      '--config',
      'e2e/playwright.config.ts',
      suite,
    ],
    {
      env: { ...process.env, WM_E2E_BASE_URL: url, WM_E2E_FIXTURE_DIR: directory },
      timeout: 180000,
    },
  );
}
async function cleanup(directory, fixture, frontend, ready, failure) {
  if (frontend) await frontend.server.close();
  await rm(join(directory, 'frontend'), { recursive: true, force: true });
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
  await runSequentialSuites(['setup.spec.ts', 'finance.spec.ts'], runSuite);
}
async function runSuite(suite) {
  const directory = join(runtime, 'e2e', randomUUID());
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const fixture = await startFixture(directory, await freePort());
  let frontend;
  let ready;
  let failure;
  try {
    ready = await waitForFixture(directory, fixture);
    frontend = await frontendPreview(directory, ready.backendUrl);
    await browserTests(directory, frontend.url, suite);
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
