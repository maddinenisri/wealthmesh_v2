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
  const response = await page.goto('/accounts/new/checking');
  expect(response?.status()).toBe(200);
  expect(response?.headers()['content-type']).toContain('text/html');
  await fillChecking(page, amount, owners);
}
async function fillChecking(page: Page, amount: string, owners = ['Maya']) {
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

test('RV-01 Gregorian balance date survives browser save, detail reload and overview', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  const response = await page.goto('/accounts/new/checking');
  expect(response?.status()).toBe(200);
  expect(response?.headers()['content-type']).toContain('text/html');
  await page.getByLabel('Name', { exact: true }).fill('Historical Checking');
  await page.getByRole('checkbox', { name: 'Name: Maya', exact: true }).check();
  await page.getByLabel('Balance (USD, optional)').fill('5000.00');
  await page.getByLabel('Balance date').fill('1582-10-10');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(
    page.getByRole('heading', { name: 'Historical Checking', exact: true }),
  ).toBeVisible();
  await expect(page.locator('time')).toHaveText('1582-10-10');
  await expect(page.locator('time')).toHaveAttribute('datetime', '1582-10-10');
  await page.reload();
  await expect(page.locator('time')).toHaveText('1582-10-10');
  const state = await overview(request);
  expect(state.accounts).toHaveLength(1);
  expect(state.accounts[0].balanceDate).toBe('1582-10-10');
  const detail = await request.get('/api/accounts/' + state.accounts[0].id);
  expect(detail.status()).toBe(200);
  expect(parseAccount(await detail.json()).balanceDate).toBe('1582-10-10');
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.locator('time')).toHaveText('1582-10-10');
  await page.reload();
  await expect(page.locator('time')).toHaveAttribute('datetime', '1582-10-10');
});

for (const mode of ['add', 'edit']) {
  test(`VD-01 concurrent household and ${mode}-member forms keep labels, errors and focus distinct`, async ({
    page,
    request,
  }) => {
    await seedMembers(request);
    await page.goto('/household');
    await page.getByRole('button', { name: 'Rename household' }).click();
    if (mode === 'edit') await page.getByRole('button', { name: 'Edit member Maya' }).click();
    const householdName = page.getByRole('textbox', { name: 'Household name', exact: true });
    const memberName = page.getByRole('textbox', { name: 'Member name', exact: true });
    await expect(householdName).toHaveValue('Maya and Sam');
    await expect(memberName).toHaveValue(mode === 'edit' ? 'Maya' : '');
    expect(await householdName.getAttribute('id')).not.toBe(await memberName.getAttribute('id'));
    if (mode === 'edit') await expect(memberName).toBeFocused();
    await householdName.fill('');
    await page.getByRole('button', { name: 'Save household name' }).click();
    await page.getByRole('link', { name: 'Enter a household name' }).press('Enter');
    await expect(householdName).toBeFocused();
    await memberName.fill('');
    await page
      .getByRole('button', { name: mode === 'edit' ? 'Save member details' : 'Add member' })
      .click();
    await page.getByRole('link', { name: 'Enter a member name' }).press('Enter');
    await expect(memberName).toBeFocused();
    await page
      .locator('form')
      .filter({ has: householdName })
      .getByRole('button', { name: 'Cancel' })
      .click();
    await expect(page.getByRole('button', { name: 'Rename household' })).toBeFocused();
    await expect(memberName).toHaveValue('');
    const state = await overview(request);
    expect(state.household?.name).toBe('Maya and Sam');
    expect(state.members.map((member) => member.name)).toEqual(['Maya', 'Sam']);
  });
}

test('VD-03 member Cancel keeps the concurrent household draft and restores its own Edit invoker', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  const before = await overview(request);
  await page.goto('/household');
  await page.getByRole('button', { name: 'Rename household' }).click();
  const householdName = page.getByRole('textbox', { name: 'Household name', exact: true });
  await householdName.fill('Unsubmitted household');
  await page.getByRole('button', { name: 'Edit member Maya' }).click();
  const memberName = page.getByRole('textbox', { name: 'Member name', exact: true });
  await memberName.fill('Unsubmitted member');
  await page
    .locator('form')
    .filter({ has: memberName })
    .getByRole('button', { name: 'Cancel' })
    .click();
  await expect(page.getByRole('button', { name: 'Edit member Maya' })).toBeFocused();
  await expect(householdName).toHaveValue('Unsubmitted household');
  expect(await overview(request)).toEqual(before);
});

test('VD-02 rejected out-of-range amount explains supported bounds and permits exact correction', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  await page.goto('/accounts/new/checking');
  await page.getByLabel('Name', { exact: true }).fill('Everyday Checking');
  await page.getByRole('checkbox', { name: 'Name: Maya', exact: true }).check();
  await page.getByLabel('Bank (optional)').fill('Harbor Bank');
  await page.getByLabel('Balance (USD, optional)').fill('1000000000000.00');
  await page.getByLabel('Balance date').fill('2026-09-01');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter a valid amount');
  await expect(page.getByLabel('Balance (USD, optional)')).toHaveAccessibleDescription(
    /between -\$999,999,999,999\.99 and \$999,999,999,999\.99/,
  );
  await expect(page.getByLabel('Balance (USD, optional)')).toHaveValue('1000000000000.00');
  await expect(page.getByRole('checkbox', { name: 'Name: Maya', exact: true })).toBeChecked();
  await expect(page.getByLabel('Bank (optional)')).toHaveValue('Harbor Bank');
  await expect(page.getByLabel('Balance date')).toHaveValue('2026-09-01');
  expect((await overview(request)).accounts).toHaveLength(0);
  await page.getByRole('alert').getByRole('link', { name: 'Enter a valid amount' }).press('Enter');
  await expect(page.getByLabel('Balance (USD, optional)')).toBeFocused();
  await page.getByLabel('Balance (USD, optional)').fill('5000.00');
  await page.getByRole('button', { name: 'Save checking account' }).click();
  await expect(page.getByRole('heading', { name: 'Everyday Checking', exact: true })).toBeVisible();
  await verifySaved(request, '5000.00', ['Maya']);
});

test('@V2_HOUSEHOLD_SETUP_001 joint checking counts once; household and member correction preserve identity after reload', async ({
  page,
  request,
}) => {
  await createHouseholdAndMembers(page);
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await page.getByRole('link', { name: 'Add checking account', exact: true }).click();
  await expect(page).toHaveURL(/\/accounts\/new\/checking$/);
  await fillChecking(page, '$5,000.00', ['Maya', 'Sam']);
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
  await expect(page.getByRole('cell', { name: '$5,000.00 USD', exact: true })).toBeVisible();
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
      await page.getByRole('link', { name: 'Add checking account', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Add checking account' })).toBeVisible();
      await expect(page).toHaveURL(/\/accounts\/new\/checking$/);
      await fillChecking(page, amount);
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
  await page.goto('/setup');
  await expect(page.getByText('Installation version 1')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Setup status', exact: true })).toBeFocused();
  const account = (await overview(request)).accounts[0];
  expect(account.balance).toBe('-125.50');
  expect(account.owners[0].label).toBe('Parent');
});

test('UI-05 modern desktop workspace reflows into complete mobile cards with keyboard access', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  await addChecking(page, '-$125.50', ['Maya', 'Sam']);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page).toHaveTitle('Overview · WealthMesh');
  await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(2);
  await expect(page.getByRole('link', { name: /Setup status|Documentation/ })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Maya and Sam', exact: true })).toBeFocused();
  await expect(page.locator('.workspace-sidebar')).toHaveCSS('width', '228px');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(246, 248, 247)');
  await expect(page.locator('h1')).toHaveCSS('font-family', 'system-ui, -apple-system, sans-serif');
  const registry = page.getByRole('table', { name: 'Accounts' });
  await expect(registry.getByRole('row')).toHaveCount(2);
  await expect(registry.getByRole('columnheader')).toHaveCount(5);
  await expect(registry.getByRole('cell', { name: '-$125.50 USD', exact: true })).toBeVisible();
  await verifyRegistryReflow(page);
  await expect(registry.locator('.mobile-label').filter({ hasText: /^Owners$/ })).toBeVisible();
  const action = page.getByRole('link', { name: 'Add checking account' });
  expect((await action.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await verifyCreationKeyboardJourney(page);
});

async function verifyRegistryReflow(page: Page) {
  const registry = page.getByRole('table', { name: 'Accounts' });
  for (const width of [900, 899, 760, 759, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.getByRole('link', { name: 'Everyday Checking' })).toBeVisible();
    await expect(registry.getByText('Harbor Bank')).toBeVisible();
    await expect(registry.getByText('Maya', { exact: true })).toBeVisible();
    await expect(registry.getByText('Sam', { exact: true })).toBeVisible();
    await expect(registry.locator('time')).toHaveText('2026-09-01');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
}

async function verifyCreationKeyboardJourney(page: Page) {
  const action = page.getByRole('link', { name: 'Add checking account' });
  await page.keyboard.press('Tab');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await action.press('Enter');
  await expect(page).toHaveTitle('Add checking account · WealthMesh');
  await expect(
    page.getByRole('heading', { name: 'Add checking account', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Cancel', exact: true }).press('Enter');
  await expect(page.getByRole('link', { name: 'Add checking account' })).toBeFocused();
  await page.goto('/accounts/new');
  await expect(page).toHaveTitle('Add account · WealthMesh');
  await expect(page.getByRole('link', { name: 'Checking', exact: true })).toBeVisible();
  await expect(page.getByText('Other account types will be added later.')).toBeVisible();
  await page.getByRole('link', { name: 'Cancel', exact: true }).press('Enter');
  await expect(page.getByRole('link', { name: 'Add checking account' })).toBeFocused();
}

test('UI-06 long owner labels and exact large totals remain complete at 320px', async ({
  page,
  request,
}) => {
  await seedMembers(request);
  const name = 'Maya ' + 'Household'.repeat(12);
  const label = 'Parent ' + 'Distinguishing'.repeat(5);
  expect(
    (await request.put('/api/household/members/' + maya, { data: { name, label } })).status(),
  ).toBe(200);
  for (const suffix of ['One', 'Two']) {
    expect(
      (
        await request.post('/api/accounts/checking', {
          data: {
            id: crypto.randomUUID(),
            name: 'Everyday ' + 'Checking'.repeat(12) + suffix,
            bank: 'Harbor ' + 'Bank'.repeat(25),
            ownerIds: [maya, sam],
            openingAmount: '999999999999.99',
            balanceDate: '2026-09-01',
          },
        })
      ).status(),
    ).toBe(201);
  }
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.total .money')).toHaveText('$1,999,999,999,999.98');
  const registry = page.getByRole('table', { name: 'Accounts' });
  await expect(registry.getByRole('listitem').filter({ hasText: name })).toHaveCount(2);
  await expect(registry.getByText('Label: ' + label, { exact: true })).toHaveCount(2);
  await expect(registry.getByRole('link')).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
