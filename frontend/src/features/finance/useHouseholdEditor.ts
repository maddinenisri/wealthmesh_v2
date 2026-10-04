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
  function done(announcement?: string) {
    if (announcement) {
      refresh();
      navigate('/household', announcement);
      return;
    }
    setReturnFocus(editing ? 'edit-member-' + editing.id : 'rename-household');
    setRename(false);
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
    done,
  };
}
