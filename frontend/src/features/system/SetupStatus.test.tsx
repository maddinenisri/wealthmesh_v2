import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { expect, it } from 'vitest';
import { server } from '../../test/setup';
import { SetupStatus } from './SetupStatus';

const endpoint = 'http://127.0.0.1:5173/api/system/status';
const ready = () => HttpResponse.json({ status: 'ready', installationVersion: '2' });

it('shows loading until the stored textual version arrives', async () => {
  server.use(
    http.get(endpoint, async () => {
      await delay(70);
      return ready();
    }),
  );
  render(<SetupStatus />);
  expect(screen.getByRole('status')).toHaveTextContent('Checking setup');
  expect(await screen.findByRole('heading', { name: 'Setup ready' })).toBeVisible();
  expect(screen.getByText('Installation version 2')).toBeVisible();
});

it('offers a keyboard accessible retry after unavailable and then shows success', async () => {
  server.use(
    http.get(endpoint, () =>
      HttpResponse.json(
        { code: 'SYSTEM_UNAVAILABLE', message: 'Setup status is unavailable.' },
        { status: 503 },
      ),
    ),
  );
  render(<SetupStatus />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Setup is unavailable');
  expect(screen.queryByText('Setup ready')).not.toBeInTheDocument();
  server.use(http.get(endpoint, ready));
  await userEvent.tab();
  expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(await screen.findByText('Installation version 2')).toBeVisible();
});

it('explains a network failure without displaying readiness', async () => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
  render(<SetupStatus />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the local server');
  expect(screen.queryByText('Setup ready')).not.toBeInTheDocument();
});

it.each([
  {},
  { status: 'ready', installationVersion: 1 },
  { status: 'unknown', installationVersion: '1' },
  { status: 'ready', installationVersion: '' },
  null,
])('rejects a malformed response %j', async (body) => {
  server.use(http.get(endpoint, () => HttpResponse.json(body)));
  render(<SetupStatus />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Unexpected response');
  expect(screen.queryByText('Setup ready')).not.toBeInTheDocument();
});

it('bounds a request that never responds', async () => {
  server.use(
    http.get(endpoint, async () => {
      await delay(100);
      return ready();
    }),
  );
  render(<SetupStatus timeoutMs={20} />);
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Request timed out'));
});

it('classifies syntactically malformed JSON as an unreadable server response', async () => {
  server.use(
    http.get(
      endpoint,
      () =>
        new HttpResponse('{incomplete-json', { headers: { 'Content-Type': 'application/json' } }),
    ),
  );
  render(<SetupStatus />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Unexpected response');
  expect(screen.queryByText('Setup ready')).not.toBeInTheDocument();
});
