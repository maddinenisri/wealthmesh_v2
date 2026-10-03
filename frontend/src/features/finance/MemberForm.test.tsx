import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { expect, it, vi } from 'vitest';
import { server } from '../../test/setup';
import { MemberForm } from './HouseholdForms';

const member = { id: '11111111-1111-4111-8111-111111111111', name: 'Sam', label: 'Parent' };
const endpoint = 'http://127.0.0.1:5173/api/household/members/' + member.id;

it.each([400, 409])(
  'keeps a rejected %s member correction with accessible label feedback',
  async (status) => {
    let writes = 0;
    const done = vi.fn();
    server.use(
      http.put(endpoint, () => {
        writes++;
        return HttpResponse.json(
          {
            code: 'MEMBER_PAIR_EXISTS',
            message: 'Use a different label',
            fieldErrors: { label: 'Use a different label' },
          },
          { status, headers: { 'X-Request-Id': 'member-reference' } },
        );
      }),
    );
    render(<MemberForm member={member} onDone={done} />);
    await userEvent.clear(screen.getByLabelText('Member name'));
    await userEvent.type(screen.getByLabelText('Member name'), 'Sam corrected');
    await userEvent.click(screen.getByRole('button', { name: 'Save member details' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('member-reference');
    expect(screen.getByRole('alert')).toHaveFocus();
    expect(screen.getByLabelText('Member name')).toHaveValue('Sam corrected');
    expect(screen.getByLabelText('Distinguishing label (optional)')).toHaveValue('Parent');
    await userEvent.click(screen.getByRole('link', { name: 'Use a different label' }));
    expect(screen.getByLabelText('Distinguishing label (optional)')).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(done).toHaveBeenCalledOnce();
    expect(writes).toBe(1);
  },
);

it('clears an optional label through a details-only command without changing member identity', async () => {
  let payload: unknown;
  const done = vi.fn();
  server.use(
    http.put(endpoint, async ({ request }) => {
      payload = await request.json();
      return HttpResponse.json({ ...member, label: null });
    }),
  );
  render(<MemberForm member={member} onDone={done} />);
  await userEvent.clear(screen.getByLabelText('Distinguishing label (optional)'));
  await userEvent.click(screen.getByRole('button', { name: 'Save member details' }));
  await waitFor(() => expect(done).toHaveBeenCalledWith('Member details saved.'));
  expect(payload).toEqual({ name: 'Sam', label: '' });
});
