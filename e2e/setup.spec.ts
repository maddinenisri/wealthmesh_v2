import { test, expect } from '@playwright/test';
import { fixtureCommand } from '../scripts/fixture-protocol.mjs';

const directory = process.env.WM_E2E_FIXTURE_DIR;
if (!directory) throw new Error('Missing disposable fixture directory.');

test('real screen reads persisted versions, handles absence, retries, and bounds database failure', async ({
  page,
  request,
}) => {
  await page.goto('/setup');
  await expect(page.getByRole('heading', { name: 'Setup ready' })).toBeVisible();
  await expect(page.getByText('Installation version 1')).toBeVisible();
  expect(
    await page.evaluate(() =>
      navigator.serviceWorker.getRegistrations().then((registrations) => registrations.length),
    ),
  ).toBe(0);
  if (process.env.WM_E2E_FORCE_ASSERTION_FAILURE === '1')
    expect('controlled cleanup exercise').toBe('intentional failure');
  await fixtureCommand(directory, 'version2');
  await page.reload();
  await expect(page.getByText('Installation version 2')).toBeVisible();
  await fixtureCommand(directory, 'missing');
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Setup is unavailable');
  const missing = await request.get('/api/system/status');
  expect(missing.status()).toBe(503);
  expect(await missing.json()).toEqual({
    code: 'SYSTEM_UNAVAILABLE',
    message: 'Setup status is unavailable.',
  });
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await fixtureCommand(directory, 'restore');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('Installation version 1')).toBeVisible();
  await fixtureCommand(directory, 'databaseStop');
  await page.reload();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Setup ready' })).toHaveCount(0);
});
