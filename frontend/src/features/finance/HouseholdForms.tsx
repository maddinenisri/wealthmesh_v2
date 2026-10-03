import { useState } from 'react';
import { readOverview, request } from '../../api/finance';
import { parseHousehold, type Member } from '../../api/financeContract';
import { Field, FormErrors, FormActions } from './FormControls';
import { normalized } from './presentation';
import { useSave } from './useSave';
import { useMemberDraft } from './useMemberDraft';
import type { Navigate } from './Navigation';

export function CreateHousehold({ navigate }: { navigate: Navigate }) {
  const [name, setName] = useState('');
  const [id] = useState(() => crypto.randomUUID());
  const save = useSave();
  function submit(event: React.FormEvent) {
    event.preventDefault();
    void save.save(
      () => request('/api/household', parseHousehold, 'POST', { id, name }),
      async () => {
        const saved = (await readOverview()).household;
        return saved?.id === id && saved.name === normalized(name) ? saved : null;
      },
      () => navigate('/', 'Household created.'),
    );
  }
  return (
    <>
      <p>Give this household a name. You can add people and checking accounts next.</p>
      <form onSubmit={submit} noValidate>
        <FormErrors message={save.message} errors={save.errors} />
        <Field
          name="name"
          label="Household name"
          required
          value={name}
          onChange={setName}
          error={save.errors.name}
        />
        <button disabled={save.pending}>Create household</button>
      </form>
    </>
  );
}

export function RenameHousehold({
  initial,
  onDone,
}: {
  initial: string;
  onDone: (announcement?: string) => void;
}) {
  const [name, setName] = useState(initial);
  const save = useSave();
  function submit(event: React.FormEvent) {
    event.preventDefault();
    void save.save(
      () => request('/api/household', parseHousehold, 'PUT', { name }),
      async () => {
        const saved = (await readOverview()).household;
        return saved?.name === normalized(name) ? saved : null;
      },
      () => onDone('Household name saved.'),
    );
  }
  return (
    <form onSubmit={submit} noValidate>
      <FormErrors message={save.message} errors={save.errors} />
      <Field
        name="name"
        label="Household name"
        required
        value={name}
        onChange={setName}
        error={save.errors.name}
      />
      <div className="actions">
        <button disabled={save.pending}>Save household name</button>
        <button type="button" disabled={save.pending} onClick={() => onDone()}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function MemberForm({
  member,
  onDone,
}: {
  member?: Member;
  onDone: (announcement?: string) => void;
}) {
  const draft = useMemberDraft(member, onDone);
  return (
    <form onSubmit={draft.submit} noValidate>
      {member && (
        <p>
          Correct this member's name or label. Their account ownership and balances stay the same.
        </p>
      )}
      <FormErrors message={draft.save.message} errors={draft.save.errors} />
      <Field
        name="name"
        label="Member name"
        required
        value={draft.name}
        onChange={draft.setName}
        error={draft.save.errors.name}
      />
      <Field
        name="label"
        label="Distinguishing label (optional)"
        value={draft.label}
        onChange={draft.setLabel}
        error={draft.save.errors.label}
        help="Use a label such as Parent or Child to tell people with the same name apart."
      />
      <FormActions
        pending={draft.save.pending}
        label={member ? 'Save member details' : 'Add member'}
        {...(member ? { cancel: () => onDone() } : {})}
      />
    </form>
  );
}
