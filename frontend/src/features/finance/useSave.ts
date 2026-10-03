import { useState } from 'react';
import { ApiFailure, ResponseFailure } from '../../api/finance';
import type { FieldErrors } from '../../api/financeContract';

type Outcome<T> =
  { kind: 'saved'; value: T } | { kind: 'failed'; errors: FieldErrors; message: string };
async function saveOutcome<T>(
  write: () => Promise<T>,
  reconcile: () => Promise<T | null>,
): Promise<Outcome<T>> {
  try {
    return { kind: 'saved', value: await write() };
  } catch (failure) {
    const reference =
      failure instanceof ResponseFailure && failure.requestId
        ? ' Request reference: ' + failure.requestId
        : '';
    if (failure instanceof ApiFailure && [400, 409].includes(failure.status))
      return {
        kind: 'failed',
        errors: failure.body.fieldErrors,
        message: failure.message + reference,
      };
    const saved = await reconcile().catch(() => null);
    if (saved !== null) return { kind: 'saved', value: saved };
    return {
      kind: 'failed',
      errors: {},
      message:
        "We couldn't confirm whether your changes were saved. Your entries are still here. Save again to retry; leaving this screen cannot undo a possible save." +
        reference,
    };
  }
}
export function useSave() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  async function save<T>(
    write: () => Promise<T>,
    reconcile: () => Promise<T | null>,
    success: (saved: T) => void,
  ) {
    if (pending) return;
    setPending(true);
    setErrors({});
    setMessage('');
    try {
      const outcome = await saveOutcome(write, reconcile);
      if (outcome.kind === 'saved') {
        success(outcome.value);
        return;
      }
      setErrors(outcome.errors);
      setMessage(outcome.message);
    } finally {
      setPending(false);
    }
  }
  return { pending, errors, message, save };
}
export type SaveState = ReturnType<typeof useSave>;
