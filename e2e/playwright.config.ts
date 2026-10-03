import { defineConfig } from '@playwright/test';

if (!process.env.WM_E2E_BASE_URL?.startsWith('http://127.0.0.1:')) {
  throw new Error('Run npm run test:e2e; an isolated loopback base URL is required.');
}
if (!process.env.WM_E2E_FIXTURE_DIR)
  throw new Error('An explicit disposable fixture directory is required.');

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: '../test-results',
  use: {
    baseURL: process.env.WM_E2E_BASE_URL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
  },
});
