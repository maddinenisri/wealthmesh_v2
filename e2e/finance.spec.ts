import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import { fixtureCommand } from '../scripts/fixture-protocol.mjs';
import { parseOverview, parseAccount } from '../frontend/src/api/financeContract';

const directory = process.env.WM_E2E_FIXTURE_DIR;
if (!directory) throw new Error('Missing disposable fixture directory.');
const maya = '11111111-1111-4111-8111-111111111111';
const sam = '22222222-2222-4222-8222-222222222222';

async function seedMembers(request: APIRequestContext) {
  expect(
    (
      await request.post('/api/household', {
        data: { id: crypto.randomUUID(), name: 'Maya and Sam' },
      })
    ).status(),
  ).toBe(201);
  for (const [id, name] of [
    [maya, 'Maya'],
    [sam, 'Sam'],
  ])
    expect((await request.post('/api/household/members', { data: { id, name } })).status()).toBe(
      201,
    );
}
async function overview(request: APIRequestContext) {
  const response = await request.get('/api/household');
  expect(response.status()).toBe(200);
  const data: unknown = await response.json();
  return parseOverview(data);
}
async function addChecking(page: Page, amount = '5000.00', owners = ['Maya']) {
  await page.goto('/accounts/new/checking');
  await page.getByLabel('Name', { exact: true }).fill('Everyday Checking');
  for (const owner of owners)
    await page.getByRole('checkbox', { name: 'Name: ' + owner, exact: true }).check();
  await page.getByLabel('Bank (optional)').fill('Harbor Bank');
  await page.getByLabel('Balance (USD, optional)').fill(amount);
  await page.getByLabel('Balance date').fill('2026-09-01');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(page.getByRole('heading', { name: 'Everyday Checking', exact: true })).toBeVisible();
}
async function verifySaved(request: APIRequestContext, amount: string, owners: string[]) {
  const state = await overview(request);
  expect(state.accounts).toHaveLength(1);
  const account = state.accounts[0];
  expect(account.balance).toBe(amount);
  expect(account.balanceDate).toBe('2026-09-01');
  expect(account.owners.map((member) => member.name)).toEqual(owners);
  expect(state.checkingTotal.amount).toBe(amount);
  const response = await request.get('/api/accounts/' + account.id);
  expect(response.status()).toBe(200);
  const detail: unknown = await response.json();
  expect(parseAccount(detail)).toEqual(account);
  return account;
}

async function createHouseholdAndMembers(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Set up your household' })).toBeVisible();
  await page.getByLabel('Household name').fill('Maya and Sam');
  await page.getByRole('button', { name: 'Create household' }).click();
  await page.getByRole('link', { name: 'Household', exact: true }).click();
  for (const name of ['Maya', 'Sam']) {
    await page.getByLabel('Member name').fill(name);
    await page.getByRole('button', { name: 'Add member', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Edit member ' + name, exact: true }),
    ).toBeVisible();
  }
}

test.beforeEach(async () => {
  await fixtureCommand(directory, 'financeReset');
});

test('@V2_HOUSEHOLD_SETUP_001 joint checking counts once; household and member correction preserve identity after reload', async ({
  page,
  request,
}) => {
  await createHouseholdAndMembers(page);
  await addChecking(page, '$5,000.00', ['Maya', 'Sam']);
  const before = await verifySaved(request, '5000.00', ['Maya', 'Sam']);
  await page.reload();
  await expect(page.getByText('$5,000.00 USD', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Household', exact: true }).click();
  await page.getByRole('button', { name: 'Rename household' }).click();
  await page.getByLabel('Household name').fill('Our Household');
  await page.getByRole('button', { name: 'Save household name' }).click();
  await expect(page.getByRole('heading', { name: 'Our Household', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit member Maya', exact: true }).click();
  await page.getByLabel('Member name').fill('Maya Patel');
  await page.getByRole('button', { name: 'Save member details' }).click();
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Our Household', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Everyday Checking' })).toHaveCount(1);
  await page.reload();
  const after = await verifySaved(request, '5000.00', ['Maya Patel', 'Sam']);
  expect(after.id).toBe(before.id);
  expect(after.owners.map((member) => member.id)).toEqual(before.owners.map((member) => member.id));
  expect(
    await page.evaluate(() =>
      navigator.serviceWorker.getRegistrations().then((items) => items.length),
    ),
  ).toBe(0);
});

test('@V2_CHECKING_001 individual creation and actual list/detail agree without income or activity actions', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  await addChecking(page, '$5,000.00');
  await expect(
    page.getByText('No money activity has been recorded.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /money in|money out|transfer|Update balance/i }),
  ).toHaveCount(0);
  await page.getByRole('link', { name: 'Back to accounts' }).click();
  await expect(page.getByText('$5,000.00 USD')).toBeVisible();
  await page.getByRole('link', { name: 'Everyday Checking' }).click();
  await page.reload();
  await verifySaved(request, '5000.00', ['Maya']);
});

for (const amount of ['', '$0.00']) {
  test(
    '@V2_CHECKING_002 and @V2_HOUSEHOLD_SETUP_003 zero example ' + (amount || 'blank'),
    async ({ page, request }) => {
      await seedMembers(request);
      await page.goto('/');
      await expect(page.getByText('No accounts added yet.', { exact: false })).toBeVisible();
      await page.getByRole('link', { name: 'Add account', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Add account' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Checking', exact: true })).toBeVisible();
      await expect(page.getByText('Other account types will be added later.')).toBeVisible();
      await addChecking(page, amount);
      await page.reload();
      await expect(page.getByText('$0.00 USD')).toBeVisible();
      await verifySaved(request, '0.00', ['Maya']);
    },
  );
}

test('@V2_CHECKING_003 details-only Sam to Maya edit preserves exact balance/date', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  await addChecking(page, '5000', ['Sam']);
  await page.getByRole('link', { name: 'Edit account', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Household Checking');
  await page.getByRole('checkbox', { name: 'Name: Sam', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'Name: Maya', exact: true }).check();
  await page.getByLabel('Bank (optional)').fill('Harbor Credit Union');
  await expect(page.getByLabel('Balance (USD, optional)')).toHaveCount(0);
  await expect(page.getByLabel('Balance date')).toHaveCount(0);
  await page.getByRole('button', { name: 'Save account details' }).click();
  await expect(
    page.getByRole('heading', { name: 'Household Checking', exact: true }),
  ).toBeVisible();
  await page.reload();
  const saved = await verifySaved(request, '5000.00', ['Maya']);
  expect(saved.name).toBe('Household Checking');
  expect(saved.bank).toBe('Harbor Credit Union');
});

test('@V2_CHECKING_004 cancel changed details sends no mutation and preserves list/detail', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  await addChecking(page);
  const before = await verifySaved(request, '5000.00', ['Maya']);
  const mutations: string[] = [];
  page.on('request', (req) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method())) mutations.push(req.url());
  });
  await page.getByRole('link', { name: 'Edit account', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Household Checking');
  await page.getByRole('checkbox', { name: 'Name: Maya', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'Name: Sam', exact: true }).check();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Everyday Checking', exact: true })).toBeVisible();
  expect(mutations).toEqual([]);
  expect(await verifySaved(request, '5000.00', ['Maya'])).toEqual(before);
});

test('@V2_CHECKING_005 blank name retains bank/amount/date; correcting then cancel creates nothing', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  await page.goto('/accounts/new/checking');
  await page.getByRole('checkbox', { name: 'Name: Maya', exact: true }).check();
  await page.getByLabel('Bank (optional)').fill('Harbor Bank');
  await page.getByLabel('Balance (USD, optional)').fill('$5,000.00');
  await page.getByLabel('Balance date').fill('2026-09-01');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter an account name');
  await expect(page.getByLabel('Bank (optional)')).toHaveValue('Harbor Bank');
  await expect(page.getByLabel('Balance (USD, optional)')).toHaveValue('$5,000.00');
  await expect(page.getByLabel('Balance date')).toHaveValue('2026-09-01');
  expect((await overview(request)).accounts).toHaveLength(0);
  await page.getByLabel('Name', { exact: true }).fill('Everyday Checking');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Maya and Sam', exact: true })).toBeVisible();
  expect((await overview(request)).accounts).toHaveLength(0);
});

test('@V2_CHECKING_017 invalid words remain an unsaved accessible draft; correction saves', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  await page.goto('/accounts/new/checking');
  await page.getByLabel('Name', { exact: true }).fill('Everyday Checking');
  await page.getByRole('checkbox', { name: 'Name: Maya', exact: true }).check();
  await page.getByLabel('Bank (optional)').fill('Harbor Bank');
  await page.getByLabel('Balance (USD, optional)').fill('five thousand');
  await page.getByLabel('Balance date').fill('2026-09-01');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter a valid amount');
  await expect(page.getByRole('alert')).toBeFocused();
  await page.getByRole('alert').getByRole('link', { name: 'Enter a valid amount' }).press('Enter');
  await expect(page.getByLabel('Balance (USD, optional)')).toBeFocused();
  await expect(page.getByLabel('Balance (USD, optional)')).toHaveValue('five thousand');
  expect((await overview(request)).accounts).toHaveLength(0);
  await page.getByLabel('Balance (USD, optional)').fill('$5,000.00');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(page.getByRole('heading', { name: 'Everyday Checking', exact: true })).toBeVisible();
  await verifySaved(request, '5000.00', ['Maya']);
});

test('@V2_HOUSEHOLD_SETUP_004 adapted checking date uses backend today and chosen past date', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  const state = await overview(request);
  await page.goto('/accounts/new/checking');
  await expect(page.getByLabel('Balance date')).toHaveValue(state.today);
  await page.getByLabel('Name', { exact: true }).fill('Everyday Checking');
  await page.getByRole('checkbox', { name: 'Name: Maya', exact: true }).check();
  await page.getByLabel('Balance (USD, optional)').fill('10000.00');
  await page.getByLabel('Balance date').fill('2026-09-01');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(page.getByRole('heading', { name: 'Everyday Checking', exact: true })).toBeVisible();
  await verifySaved(request, '10000.00', ['Maya']);
});

test('overdrafts, distinguishing labels and mobile keyboard controls retain complete visible information', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  expect(
    (
      await request.post('/api/household/members', {
        data: { id: crypto.randomUUID(), name: 'Sam', label: 'Parent' },
      })
    ).status(),
  ).toBe(201);
  await page.setViewportSize({ width: 390, height: 844 });
  await addChecking(page, '-$125.50', ['Sam; Label: Parent']);
  await expect(page.getByText('Label: Parent')).toBeVisible();
  await expect(page.getByText('-$125.50 USD')).toBeVisible();
  await page.getByRole('link', { name: 'Back to accounts' }).click();
  await page.addStyleTag({ content: 'body { zoom: 2; }' });
  await expect(page.getByRole('link', { name: 'Everyday Checking' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('link', { name: 'Setup status', exact: true }).press('Enter');
  await expect(page.getByText('Installation version 1')).toBeVisible();
  const account = (await overview(request)).accounts[0];
  expect(account.balance).toBe('-125.50');
  expect(account.owners[0].label).toBe('Parent');
});
