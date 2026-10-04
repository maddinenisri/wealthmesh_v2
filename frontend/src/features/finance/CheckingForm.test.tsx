import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { expect, it, vi } from 'vitest';
import { server } from '../../test/setup';
import { CheckingForm } from './CheckingForm';
import type { Overview } from '../../api/financeContract';

const maya = { id: '11111111-1111-4111-8111-111111111111', name: 'Maya', label: null };
const overview: Overview = {
  household: { id: '33333333-3333-4333-8333-333333333333', name: 'Maya and Sam' },
  members: [maya],
  accounts: [],
  checkingTotal: { currency: 'USD', amount: '0.00' },
  today: '2026-09-05',
  financialZone: 'America/New_York',
};
const create = 'http://127.0.0.1:5173/api/accounts/checking';
const detail = 'http://127.0.0.1:5173/api/accounts/:id';
async function enterChecking() {
  await userEvent.type(screen.getByLabelText('Name'), 'Everyday Checking');
  await userEvent.click(screen.getByRole('checkbox', { name: 'Name: Maya' }));
  await userEvent.type(screen.getByLabelText('Bank (optional)'), 'Harbor Bank');
  await userEvent.type(screen.getByLabelText('Balance (USD, optional)'), '$5,000.00');
}
function saved(id: string) {
  return {
    id,
    type: 'CHECKING',
    name: 'Everyday Checking',
    bank: 'Harbor Bank',
    owners: [maya],
    currency: 'USD',
    balance: '5000.00',
    balanceDate: '2026-09-05',
  };
}

it('explains the exact supported range while retaining an out-of-range draft', async () => {
  server.use(
    http.post(create, () =>
      HttpResponse.json(
        {
          code: 'INVALID_INPUT',
          message: 'Enter a valid amount',
          fieldErrors: { openingAmount: 'Enter a valid amount' },
        },
        { status: 400 },
      ),
    ),
  );
  render(<CheckingForm overview={overview} navigate={vi.fn()} />);
  await enterChecking();
  await userEvent.clear(screen.getByLabelText('Balance (USD, optional)'));
  await userEvent.type(screen.getByLabelText('Balance (USD, optional)'), '1000000000000.00');
  await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Enter a valid amount');
  expect(screen.getByLabelText('Balance (USD, optional)')).toHaveAccessibleDescription(
    expect.stringContaining('between -$999,999,999,999.99 and $999,999,999,999.99'),
  );
  expect(screen.getByLabelText('Balance (USD, optional)')).toHaveValue('1000000000000.00');
  expect(screen.getByRole('checkbox', { name: 'Name: Maya' })).toBeChecked();
});

it('one automatic reread confirms a committed create after the response is lost', async () => {
  let id = '';
  let reads = 0;
  let writes = 0;
  const navigate = vi.fn();
  server.use(
    http.post(create, async ({ request }) => {
      const data: unknown = await request.json();
      if (typeof data === 'object' && data !== null && 'id' in data && typeof data.id === 'string')
        id = data.id;
      writes++;
      return HttpResponse.error();
    }),
    http.get(detail, () => {
      reads++;
      return HttpResponse.json(saved(id));
    }),
  );
  render(<CheckingForm overview={overview} navigate={navigate} />);
  await enterChecking();
  await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
  await waitFor(() =>
    expect(navigate).toHaveBeenCalledWith('/accounts/' + id, 'Checking account created.'),
  );
  expect(reads).toBe(1);
  expect(writes).toBe(1);
});

it.each(['unavailable', 'malformed', 'network'])(
  'retains an uncertain %s draft and deliberately retries with the same UUID without auto-resubmitting',
  async (failure) => {
    const ids: unknown[] = [];
    let reads = 0;
    const navigate = vi.fn();
    server.use(
      http.post(create, async ({ request }) => {
        const data: unknown = await request.json();
        ids.push(data);
        if (failure === 'network') return HttpResponse.error();
        if (failure === 'malformed') return HttpResponse.json({ bad: true });
        return HttpResponse.json(
          { code: 'FINANCE_UNAVAILABLE', message: 'Unavailable', fieldErrors: {} },
          { status: 503, headers: { 'X-Request-Id': 'synthetic-reference' } },
        );
      }),
      http.get(detail, () => {
        reads++;
        return HttpResponse.json(
          { code: 'NOT_FOUND', message: 'Missing', fieldErrors: {} },
          { status: 404 },
        );
      }),
    );
    render(<CheckingForm overview={overview} navigate={navigate} />);
    await enterChecking();
    await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "couldn't confirm whether your changes were saved",
    );
    expect(screen.getByLabelText('Balance (USD, optional)')).toHaveValue('$5,000.00');
    expect(ids).toHaveLength(1);
    expect(reads).toBe(1);
    expect(navigate).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
    await waitFor(() => expect(reads).toBe(2));
    expect(ids).toHaveLength(2);
    expect(ids[1]).toEqual(ids[0]);
  },
);

it('does not accept different saved details or a runtime-invalid response as reconciliation', async () => {
  server.use(
    http.post(create, () => HttpResponse.json({ invalid: true })),
    http.get(detail, () =>
      HttpResponse.json({ ...saved('44444444-4444-4444-8444-444444444444'), balance: 5000 }),
    ),
  );
  const navigate = vi.fn();
  render(<CheckingForm overview={overview} navigate={navigate} />);
  await enterChecking();
  await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
  expect(await screen.findByRole('alert')).toHaveTextContent("couldn't confirm");
  expect(navigate).not.toHaveBeenCalled();
});

it('disables Save and Cancel while a response is pending', async () => {
  let id = '';
  server.use(
    http.post(create, async ({ request }) => {
      const value: unknown = await request.json();
      if (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        typeof value.id === 'string'
      )
        id = value.id;
      await delay(150);
      return HttpResponse.json(saved(id), { status: 201 });
    }),
  );
  render(<CheckingForm overview={overview} navigate={vi.fn()} />);
  await enterChecking();
  await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
  expect(screen.getByRole('button', { name: 'Save checking account' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Save checking account' })).toBeEnabled(),
  );
});

it('unsubmitted Cancel discards fields without any request', async () => {
  const navigate = vi.fn();
  render(<CheckingForm overview={overview} navigate={navigate} />);
  await enterChecking();
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(navigate).toHaveBeenCalledWith('/', '', 'add-account');
});

it('rejects a matching-looking reread for a different resource identifier', async () => {
  server.use(
    http.post(create, () => HttpResponse.error()),
    http.get(detail, () => HttpResponse.json(saved('44444444-4444-4444-8444-444444444444'))),
  );
  const navigate = vi.fn();
  render(<CheckingForm overview={overview} navigate={navigate} />);
  await enterChecking();
  await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
  expect(await screen.findByRole('alert')).toHaveTextContent("couldn't confirm");
  expect(navigate).not.toHaveBeenCalled();
});

it('retains the available request reference when a command response is malformed', async () => {
  server.use(
    http.post(create, () =>
      HttpResponse.json({ invalid: true }, { headers: { 'X-Request-Id': 'synthetic-malformed' } }),
    ),
    http.get(detail, () => HttpResponse.error()),
  );
  render(<CheckingForm overview={overview} navigate={vi.fn()} />);
  await enterChecking();
  await userEvent.click(screen.getByRole('button', { name: 'Save checking account' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Request reference: synthetic-malformed',
  );
});
