import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, expect, it } from 'vitest';
import { server } from '../../test/setup';
import { App } from '../../App';

const endpoint = 'http://127.0.0.1:5173/api/household';
const empty = {
  household: null,
  members: [],
  accounts: [],
  checkingTotal: { currency: 'USD', amount: '0.00' },
  today: '2026-09-05',
  financialZone: 'America/New_York',
};
beforeEach(() => window.history.replaceState(null, '', '/'));

it('shows onboarding only after a valid successful null household response', async () => {
  server.use(
    http.get(endpoint, () => HttpResponse.json(empty)),
    http.get('http://127.0.0.1:5173/api/system/status', () =>
      HttpResponse.json({ status: 'ready', installationVersion: '1' }),
    ),
  );
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Set up your household' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Setup status' })).toHaveAttribute('href', '/setup');
  expect(screen.getByRole('link', { name: 'Documentation' })).toBeVisible();
  expect(screen.getByLabelText('Household name')).toBeRequired();
});

it('keeps diagnostics accessible on a finance failure without invented zero or onboarding', async () => {
  server.use(
    http.get(endpoint, () =>
      HttpResponse.json(
        { code: 'FINANCE_UNAVAILABLE', message: 'Unavailable', fieldErrors: {} },
        { status: 503, headers: { 'X-Request-Id': 'read-reference-123' } },
      ),
    ),
    http.get('http://127.0.0.1:5173/api/system/status', () =>
      HttpResponse.json({ status: 'ready', installationVersion: '1' }),
    ),
  );
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't load your household");
  expect(screen.getByText('Request reference: read-reference-123')).toBeVisible();
  expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('link', { name: 'Setup status' }));
  expect(await screen.findByText('Installation version 1')).toBeVisible();
});

it('rejects malformed financial runtime responses instead of showing a successful empty overview', async () => {
  server.use(
    http.get(endpoint, () =>
      HttpResponse.json({ ...empty, checkingTotal: { currency: 'USD', amount: 0 } }),
    ),
    http.get('http://127.0.0.1:5173/api/system/status', () =>
      HttpResponse.json({ status: 'ready', installationVersion: '1' }),
    ),
  );
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't load your household");
  expect(screen.queryByRole('heading', { name: 'Set up your household' })).not.toBeInTheDocument();
});

const maya = { id: '11111111-1111-4111-8111-111111111111', name: 'Maya', label: null };
const household = {
  ...empty,
  household: { id: '33333333-3333-4333-8333-333333333333', name: 'Maya and Sam' },
  members: [maya],
};

function rejectConcurrentNames() {
  const rejected = (message: string) =>
    HttpResponse.json(
      { code: 'INVALID_INPUT', message, fieldErrors: { name: message } },
      { status: 400 },
    );
  server.use(
    http.get(endpoint, () => HttpResponse.json(household)),
    http.put(endpoint, () => rejected('Enter a household name')),
    http.post(endpoint + '/members', () => rejected('Enter a member name')),
    http.put(endpoint + '/members/' + maya.id, () => rejected('Enter a member name')),
  );
}

it.each(['add', 'edit'])(
  'keeps concurrent household and %s-member labels and error focus distinct',
  async (mode) => {
    window.history.replaceState(null, '', '/household');
    rejectConcurrentNames();
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'Rename household' }));
    if (mode === 'edit')
      await userEvent.click(screen.getByRole('button', { name: 'Edit member Maya' }));
    const householdName = screen.getByRole('textbox', { name: /^Household name$/ });
    const memberName = screen.getByRole('textbox', { name: /^Member name$/ });
    expect(memberName).not.toBe(householdName);
    expect(householdName.id).not.toBe(memberName.id);
    if (mode === 'edit') expect(memberName).toHaveFocus();
    await userEvent.clear(householdName);
    await userEvent.click(screen.getByRole('button', { name: 'Save household name' }));
    await userEvent.click(await screen.findByRole('link', { name: 'Enter a household name' }));
    expect(householdName).toHaveFocus();
    await userEvent.clear(memberName);
    await userEvent.click(
      screen.getByRole('button', { name: mode === 'edit' ? 'Save member details' : 'Add member' }),
    );
    await userEvent.click(await screen.findByRole('link', { name: 'Enter a member name' }));
    expect(memberName).toHaveFocus();
    expect(
      document.getElementById(memberName.getAttribute('aria-describedby') ?? ''),
    ).toHaveTextContent('Enter a member name');
    const form = householdName.closest('form');
    if (!form) throw new Error('Household input must remain inside its form.');
    await userEvent.click(within(form).getByRole('button', { name: 'Cancel' }));
    expect(
      screen.getByRole('button', {
        name: mode === 'edit' ? 'Edit member Maya' : 'Rename household',
      }),
    ).toHaveFocus();
  },
);

it('keeps invalid raw amount and every entered field, then cancels without another command', async () => {
  window.history.replaceState(null, '', '/accounts/new/checking');
  let writes = 0;
  server.use(
    http.get(endpoint, () => HttpResponse.json(household)),
    http.post('http://127.0.0.1:5173/api/accounts/checking', () => {
      writes++;
      return HttpResponse.json(
        {
          code: 'INVALID_INPUT',
          message: 'Enter a valid amount',
          fieldErrors: { openingAmount: 'Enter a valid amount' },
        },
        { status: 400 },
      );
    }),
    http.get('http://127.0.0.1:5173/api/system/status', () =>
      HttpResponse.json({ status: 'ready', installationVersion: '1' }),
    ),
  );
  render(<App />);
  await userEvent.type(await screen.findByLabelText('Name'), 'Everyday Checking');
  await userEvent.click(screen.getByRole('checkbox', { name: 'Name: Maya' }));
  await userEvent.type(screen.getByLabelText('Bank (optional)'), 'Harbor Bank');
  await userEvent.type(screen.getByLabelText('Balance (USD, optional)'), 'five thousand');
  await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Enter a valid amount');
  expect(screen.getByLabelText('Balance (USD, optional)')).toHaveValue('five thousand');
  expect(screen.getByLabelText('Bank (optional)')).toHaveValue('Harbor Bank');
  expect(screen.getByLabelText('Balance date')).toHaveValue('2026-09-05');
  expect(screen.getByLabelText('Balance (USD, optional)')).toHaveAttribute('aria-invalid', 'true');
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(await screen.findByRole('heading', { name: 'Maya and Sam' })).toBeVisible();
  expect(writes).toBe(1);
  expect(screen.getByRole('link', { name: 'Add account' })).toHaveFocus();
});

it('shows joint checking once with exact cents and clear opening-only limits', async () => {
  const account = {
    id: '44444444-4444-4444-8444-444444444444',
    type: 'CHECKING',
    name: 'Everyday Checking',
    bank: 'Harbor Bank',
    owners: [maya, { id: '22222222-2222-4222-8222-222222222222', name: 'Sam', label: 'Parent' }],
    currency: 'USD',
    balance: '5000.00',
    balanceDate: '2026-09-01',
  };
  server.use(
    http.get(endpoint, () =>
      HttpResponse.json({
        ...household,
        accounts: [account],
        checkingTotal: { currency: 'USD', amount: '5000.00' },
      }),
    ),
    http.get('http://127.0.0.1:5173/api/accounts/' + account.id, () => HttpResponse.json(account)),
    http.get('http://127.0.0.1:5173/api/system/status', () =>
      HttpResponse.json({ status: 'ready', installationVersion: '1' }),
    ),
  );
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Maya and Sam' })).toBeVisible();
  expect(screen.getByText('Shared accounts are counted once.', { exact: false })).toBeVisible();
  expect(screen.getAllByRole('link', { name: 'Everyday Checking' })).toHaveLength(1);
  await userEvent.click(screen.getByRole('link', { name: 'Everyday Checking' }));
  expect(await screen.findByRole('heading', { name: 'Everyday Checking' })).toBeVisible();
  expect(screen.getByText('No money activity has been recorded.', { exact: false })).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Update balance' })).not.toBeInTheDocument();
  expect(screen.getByText('Label: Parent')).toBeVisible();
});

it('offers stable-identity member correction with saved prefill and no write on cancel', async () => {
  window.history.replaceState(null, '', '/household');
  server.use(
    http.get(endpoint, () => HttpResponse.json(household)),
    http.get('http://127.0.0.1:5173/api/system/status', () =>
      HttpResponse.json({ status: 'ready', installationVersion: '1' }),
    ),
  );
  render(<App />);
  await userEvent.click(await screen.findByRole('button', { name: 'Edit member Maya' }));
  expect(screen.getByLabelText('Member name')).toHaveValue('Maya');
  expect(
    screen.getByText('Their account ownership and balances stay the same.', { exact: false }),
  ).toBeVisible();
  await userEvent.type(screen.getByLabelText('Member name'), ' Patel');
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(await screen.findByRole('button', { name: 'Edit member Maya' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Edit member Maya' })).toHaveFocus();
});

it.each([404, 503])(
  'distinguishes actual missing checking from a failed read (%s)',
  async (status) => {
    const id = '44444444-4444-4444-8444-444444444444';
    window.history.replaceState(null, '', '/accounts/' + id);
    server.use(
      http.get(endpoint, () => HttpResponse.json(household)),
      http.get('http://127.0.0.1:5173/api/accounts/' + id, () =>
        HttpResponse.json(
          {
            code: status === 404 ? 'NOT_FOUND' : 'FINANCE_UNAVAILABLE',
            message: 'Unavailable',
            fieldErrors: {},
          },
          { status },
        ),
      ),
    );
    render(<App />);
    expect(
      await screen.findByRole('heading', {
        name: status === 404 ? "This account couldn't be found" : 'Checking account unavailable',
      }),
    ).toBeVisible();
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
    if (status === 503) expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();
  },
);
