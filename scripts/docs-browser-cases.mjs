import { expect } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { root } from './paths.mjs';

export async function readerCases(page, address) {
  await page.goto(address);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('household financial health');
  await expect(page.locator('.mermaid-output svg')).toBeVisible();
  await page.getByRole('link', { name: 'Original diagram source' }).click();
  await page.getByText('Read or copy diagram source', { exact: true }).click();
  await expect(page.locator('.mermaid-diagram pre')).toContainText('Separate role agents');
  await expect(page.getByText('docs/index.md', { exact: true }).first()).toBeVisible();
  for (const route of [
    'questions',
    'decisions',
    'agent-roles',
    'features/setup/agent-protocol',
    'features/setup/acceptance-test-plan',
    'operations/',
  ]) {
    await page.goto(`${address}/${route}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Document not found', { exact: true })).toHaveCount(0);
  }
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('acceptance test plan');
  await page.getByRole('button', { name: 'Search documentation' }).click();
  await page.locator('#localsearch-input').fill('Testcontainers');
  await expect(page.locator('#localsearch-list')).toBeVisible();
  await expect(page.locator('#localsearch-list [role=option]')).not.toHaveCount(0);
  await page.locator('#localsearch-input').fill('NoSuchHouseholdDocZZZZ');
  await expect(page.getByText(/No matching documentation pages/)).toBeVisible();
  await page.keyboard.press('Escape');
}
export async function hotUpdateCases(page, address, docsPath) {
  await page.goto(address);
  const path = join(docsPath, 'index.md');
  const original = await readFile(path, 'utf8');
  const term = `HouseholdProbe${randomUUID().replaceAll('-', '')}`;
  await writeFile(path, `${original}\n## ${term}\n\nSynthetic local hot-update evidence.\n`);
  await expect(page.getByRole('heading', { name: term })).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'Search documentation' }).click();
  await page.locator('#localsearch-input').fill(term);
  await expect(page.locator('#localsearch-list')).toContainText(term, { timeout: 15000 });
  await page.keyboard.press('Escape');
}
export async function failureAndAccessCases(page, address, temporary, docsPath) {
  await writeFile(
    join(docsPath, 'broken-diagram.md'),
    '# Diagram failure fixture\n\nReadable ordinary text.\n\n```mermaid\nthis is not a diagram\n```\n',
  );
  await page.goto(`${address}/broken-diagram`);
  await expect(page.getByRole('alert')).toContainText('Diagram did not render');
  await expect(page.locator('.mermaid-diagram pre')).toContainText('this is not a diagram');
  await expect(page.getByText('Readable ordinary text.')).toBeVisible();
  await filesystemCases(page, address, temporary, docsPath);
  await page.goto(`${address}/no-such-document`);
  await expect(page.getByText('Document not found', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Start here', exact: true }).last().click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('household financial health');
}
async function filesystemCases(page, address, temporary, docsPath) {
  await writeFile(join(temporary, '.env'), 'SYNTHETIC_DOCS_ACCESS_PROBE=not-a-secret\n');
  for (const path of [
    join(temporary, '.env'),
    join(root, '.runtime/local.env'),
    join(root, '../wealthmesh/docs/requirements/v2/README.md'),
    '/etc/hosts',
  ]) {
    const response = await page.request.get(`${address}/@fs${path}`);
    expect([403, 404]).toContain(response.status());
  }
  for (const name of ['.runtime', '.tools', '.git', '.aws']) {
    const directory = join(docsPath, name);
    await mkdir(directory, { recursive: true });
    const canary = join(directory, 'synthetic-canary.txt');
    await writeFile(canary, 'NONSECRET_PRIVATE_PATH_PROBE');
    const response = await page.request.get(`${address}/@fs${canary}`);
    expect([403, 404]).toContain(response.status());
  }
  const outsideDocs = await page.request.get(`${address}/@fs${join(root, 'README.md')}`);
  expect([403, 404]).toContain(outsideDocs.status());
}
export async function accessibilityCases(page, address) {
  await page.goto(address);
  await expect(page.locator('.mermaid-output svg')).toBeVisible();
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#VPContent')).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const width = await page.evaluate(() => ({
    viewport: innerWidth,
    article: document.documentElement.scrollWidth,
  }));
  expect(width.article).toBeLessThanOrEqual(width.viewport);
  await page.goto(`${address}/operations/#verify-behavior`);
  await expect(page.getByRole('heading', { name: 'Verify behavior' })).toBeVisible();
  await expect(page.locator('.vp-doc table').first()).toBeVisible();
  await expect(page.locator('.vp-doc pre').first()).toBeVisible();
  await page.getByRole('button', { name: 'mobile navigation' }).click();
  await expect(page.getByRole('link', { name: 'Questions', exact: true }).first()).toBeVisible();
}
