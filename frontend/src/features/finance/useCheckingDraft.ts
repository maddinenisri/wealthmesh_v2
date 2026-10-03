import { useState } from 'react';
import { readAccount, request } from '../../api/finance';
import { parseAccountFor, type Account, type Overview } from '../../api/financeContract';
import type { Navigate } from './Navigation';
import { draftAmount, normalized, nullable } from './presentation';
import { useSave, type SaveState } from './useSave';

type DetailsDraft = { name: string; bank: string; ownerIds: string[] };
function sameDetails(saved: Account, draft: DetailsDraft) {
  const owners = saved.owners.map((owner) => owner.id);
  return (
    saved.name === normalized(draft.name) &&
    saved.bank === nullable(draft.bank) &&
    owners.length === draft.ownerIds.length &&
    owners.every((id) => draft.ownerIds.includes(id))
  );
}
export function useCheckingDraft(
  overview: Overview,
  account: Account | undefined,
  navigate: Navigate,
) {
  const [id] = useState(() => account?.id ?? crypto.randomUUID());
  const [name, setName] = useState(account?.name ?? '');
  const [bank, setBank] = useState(account?.bank ?? '');
  const [ownerIds, setOwners] = useState(account?.owners.map((member) => member.id) ?? []);
  const [amount, setAmount] = useState('');
  const [balanceDate, setDate] = useState(overview.today);
  const save = useSave();
  return {
    name,
    setName,
    bank,
    setBank,
    ownerIds,
    setOwners,
    amount,
    setAmount,
    balanceDate,
    setDate,
    save,
    submit: (event: React.FormEvent) =>
      submitChecking(
        event,
        { id, name, bank, ownerIds, amount, balanceDate },
        account,
        navigate,
        save,
      ),
  };
}
export type CheckingDraft = ReturnType<typeof useCheckingDraft>;

type CheckingValues = DetailsDraft & { id: string; amount: string; balanceDate: string };
function submitChecking(
  event: React.FormEvent,
  draft: CheckingValues,
  account: Account | undefined,
  navigate: Navigate,
  save: SaveState,
) {
  const { id, name, bank, ownerIds, amount, balanceDate } = draft;

  event.preventDefault();
  const details = { name, bank, ownerIds };
  const payload = account ? details : { id, ...details, openingAmount: amount, balanceDate };
  const path = account ? '/api/accounts/' + id + '/details' : '/api/accounts/checking';
  void save.save(
    () => request(path, parseAccountFor(id), account ? 'PUT' : 'POST', payload),
    async () => {
      const saved = await readAccount(id);
      const moneyMatches =
        account !== undefined ||
        (saved.balance === draftAmount(amount) && saved.balanceDate === balanceDate);
      return sameDetails(saved, details) && moneyMatches ? saved : null;
    },
    () =>
      navigate('/accounts/' + id, account ? 'Account details saved.' : 'Checking account created.'),
  );
}
