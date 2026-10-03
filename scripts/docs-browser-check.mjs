import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import { cp, mkdir, mkdtemp, open, symlink, writeFile, rm, realpath } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { root, runtime, prepareRuntime } from './paths.mjs';
import { waitUntil } from './commands.mjs';
import { freePort } from './e2e-support.mjs';
import {
  readerCases,
  hotUpdateCases,
  failureAndAccessCases,
  accessibilityCases,
} from './docs-browser-cases.mjs';

async function isolatedReader() {
  const temporary = await realpath(await mkdtemp(join(tmpdir(), 'wealthmesh-docs-')));
  const docsPath = join(temporary, 'docs');
  await cp(join(root, 'docs'), docsPath, {
    recursive: true,
    filter: (path) => !/\/(dist|cache|snapshots)(\/|$)/.test(path),
  });
  await symlink(join(root, 'node_modules'), join(temporary, 'node_modules'));
  const port = await freePort();
  const log = await open(join(runtime, 'docs-browser.log'), 'w', 0o600);
  const process = spawn(
    globalThis.process.execPath,
    [
      join(root, 'node_modules/vitepress/bin/vitepress.js'),
      'dev',
      docsPath,
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: temporary,
      env: { ...globalThis.process.env, WM_DOCS_PORT: String(port) },
      stdio: ['ignore', log.fd, log.fd],
    },
  );
  await log.close();
  return { temporary, docsPath, process, address: `http://127.0.0.1:${port}` };
}
async function ready(reader) {
  await waitUntil(
    async () => {
      if (reader.process.exitCode !== null)
        throw new Error('Isolated docs reader exited; see .runtime/docs-browser.log');
      try {
        return (await fetch(reader.address)).ok;
      } catch {
        return false;
      }
    },
    'isolated documentation reader',
    30000,
  );
}
async function saveEvidence(page) {
  await mkdir(join(runtime, 'docs-evidence'), { recursive: true });
  await page.screenshot({
    path: join(runtime, 'docs-evidence/narrow-reader.png'),
    fullPage: true,
  });
  await writeFile(
    join(runtime, 'docs-evidence/result.json'),
    JSON.stringify(
      {
        passed: true,
        cases: [
          'navigation',
          'search',
          'empty search',
          'Mermaid and source',
          'diagram error',
          'live Markdown/search update',
          'filesystem isolation',
          'missing page',
          'keyboard',
          'narrow viewport',
        ],
      },
      null,
      2,
    ),
  );
}
async function run() {
  await prepareRuntime();
  const reader = await isolatedReader();
  let browser;
  let page;
  try {
    await ready(reader);
    browser = await chromium.launch();
    page = await browser.newPage();
    await readerCases(page, reader.address);
    await hotUpdateCases(page, reader.address, reader.docsPath);
    await failureAndAccessCases(page, reader.address, reader.temporary, reader.docsPath);
    page = await browser.newPage();
    await accessibilityCases(page, reader.address);
    await saveEvidence(page);
    console.log('Ten docs browser cases passed; .runtime/docs-evidence/result.json');
  } catch (error) {
    await writeFile(
      join(runtime, 'docs-failure.txt'),
      (await page?.locator('body').innerText()) ?? error.message,
    );
    if (page) await page.screenshot({ path: join(runtime, 'docs-failure.png'), fullPage: true });
    throw error;
  } finally {
    await browser?.close();
    reader.process.kill('SIGTERM');
    await waitUntil(
      () => reader.process.exitCode !== null || reader.process.signalCode !== null,
      'reader cleanup',
      10000,
    );
    await rm(reader.temporary, { recursive: true });
  }
}
await run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
