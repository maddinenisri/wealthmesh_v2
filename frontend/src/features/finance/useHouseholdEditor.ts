import { useEffect, useState } from 'react';
import type { Member } from '../../api/financeContract';
import type { Navigate } from './Navigation';
export function useHouseholdEditor(refresh: () => void, navigate: Navigate) {
  const [rename, setRename] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [returnFocus, setReturnFocus] = useState<string | null>(null);
  useEffect(() => {
    if (returnFocus) document.getElementById(returnFocus)?.focus();
  }, [rename, editing, returnFocus]);
  function householdDone(announcement?: string) {
    if (finishSave(announcement, refresh, navigate)) return;
    setReturnFocus('rename-household');
    setRename(false);
  }
  function memberDone(announcement?: string) {
    if (finishSave(announcement, refresh, navigate) || !editing) return;
    setReturnFocus('edit-member-' + editing.id);
    setEditing(null);
  }
  return {
    rename,
    editing,
    openRename: () => {
      setReturnFocus(null);
      setRename(true);
    },
    openMember: (member: Member) => {
      setReturnFocus(null);
      setEditing(member);
    },
    householdDone,
    memberDone,
  };
}
function finishSave(announcement: string | undefined, refresh: () => void, navigate: Navigate) {
  if (!announcement) return false;
  refresh();
  navigate('/household', announcement);
  return true;
}
