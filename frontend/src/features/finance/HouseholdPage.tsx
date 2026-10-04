import { useHouseholdEditor } from './useHouseholdEditor';
import type { Overview, Member } from '../../api/financeContract';
import { MemberNames } from './FormControls';
import { MemberForm, RenameHousehold } from './HouseholdForms';
import { Heading, type Navigate } from './Navigation';

type HouseholdPageProps = { overview: Overview; refresh: () => void; navigate: Navigate };
export function HouseholdPage({ overview, refresh, navigate }: HouseholdPageProps) {
  const { rename, editing, openRename, openMember, householdDone, memberDone } = useHouseholdEditor(
    refresh,
    navigate,
  );
  return (
    <>
      <Heading>Household</Heading>
      <div className="household-grid">
        <section className="panel" aria-label="Household details">
          <h2>{overview.household?.name}</h2>
          {rename ? (
            <RenameHousehold initial={overview.household?.name ?? ''} onDone={householdDone} />
          ) : (
            <button id="rename-household" onClick={openRename}>
              Rename household
            </button>
          )}
        </section>
        <section className="panel" aria-labelledby="members-heading">
          <h2 id="members-heading">Members</h2>
          <p>Members are names you attach to account ownership. They do not sign in.</p>
          <MembersSection
            members={overview.members}
            editing={editing}
            edit={openMember}
            done={memberDone}
          />
        </section>
      </div>
      <p>
        <a href="/">Back to overview</a>
      </p>
      <p className="helper">
        When two tabs save details, the later save replaces overlapping details. Use one editing tab
        to avoid overwrites.
      </p>
    </>
  );
}

type MembersProps = {
  members: Member[];
  editing: Member | null;
  edit: (member: Member) => void;
  done: (announcement?: string) => void;
};
function MembersSection({ members, editing, edit, done }: MembersProps) {
  if (editing) return <MemberForm key={editing.id} member={editing} onDone={done} />;
  return (
    <>
      <ul className="members">
        {members.map((member) => (
          <li key={member.id}>
            <MemberNames members={[member]} />
            <button
              id={'edit-member-' + member.id}
              onClick={() => edit(member)}
              aria-label={'Edit member ' + member.name + (member.label ? ' ' + member.label : '')}
            >
              Edit member
            </button>
          </li>
        ))}
      </ul>
      <h3>Add member</h3>
      <MemberForm onDone={done} />
    </>
  );
}
