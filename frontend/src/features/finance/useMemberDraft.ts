import { useState } from 'react';
import { readOverview, request } from '../../api/finance';
import { parseMember, type Member } from '../../api/financeContract';
import { normalized, nullable } from './presentation';
import { useSave, type SaveState } from './useSave';
type MemberValues = { id: string; name: string; label: string };
function submitMember(
  event: React.FormEvent,
  draft: MemberValues,
  member: Member | undefined,
  save: SaveState,
  success: () => void,
) {
  event.preventDefault();
  const { id, name, label } = draft;
  const payload = member ? { name, label } : { id, name, label };
  void save.save(
    () =>
      request(
        '/api/household/members' + (member ? '/' + id : ''),
        parseMember,
        member ? 'PUT' : 'POST',
        payload,
      ),
    async () => {
      const saved = (await readOverview()).members.find((item) => item.id === id);
      return saved?.name === normalized(name) && saved.label === nullable(label) ? saved : null;
    },
    success,
  );
}
export function useMemberDraft(
  member: Member | undefined,
  onDone: (announcement?: string) => void,
) {
  const [name, setName] = useState(member?.name ?? '');
  const [label, setLabel] = useState(member?.label ?? '');
  const [id, setId] = useState(() => member?.id ?? crypto.randomUUID());
  const save = useSave();
  function success() {
    setName('');
    setLabel('');
    setId(crypto.randomUUID());
    onDone(member ? 'Member details saved.' : 'Member added.');
  }
  return {
    name,
    setName,
    label,
    setLabel,
    save,
    submit: (event: React.FormEvent) =>
      submitMember(event, { id, name, label }, member, save, success),
  };
}
