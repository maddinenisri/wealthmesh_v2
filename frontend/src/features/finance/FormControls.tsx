import { createContext, useContext, useEffect, useId, useRef, type ComponentProps } from 'react';
import type { FieldErrors, Member } from '../../api/financeContract';
import { memberName } from './presentation';

const FormScope = createContext('finance');
type FinanceFormProps = ComponentProps<'form'> & { focusName?: boolean };
export function FinanceForm({ children, focusName, ...props }: FinanceFormProps) {
  const scope = useId();
  const reference = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (focusName) reference.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus();
  }, [focusName]);
  return (
    <FormScope value={scope}>
      <form {...props} ref={reference}>
        {children}
      </form>
    </FormScope>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  type?: string;
  help?: string | undefined;
  required?: boolean;
};
export function Field(props: FieldProps) {
  const { label, name, value, onChange, error, type = 'text', help, required } = props;
  const id = useContext(FormScope) + '-' + name;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          [help ? id + '-help' : null, error ? id + '-error' : null].filter(Boolean).join(' ') ||
          undefined
        }
      />
      <FieldMessages name={id} help={help} error={error} />
    </div>
  );
}
function FieldMessages({ name, help, error }: Pick<FieldProps, 'name' | 'help' | 'error'>) {
  return (
    <>
      {help && (
        <p className="helper" id={name + '-help'}>
          {help}
        </p>
      )}
      {error && (
        <p className="field-error" id={name + '-error'}>
          {error}
        </p>
      )}
    </>
  );
}
type OwnersProps = {
  members: Member[];
  selected: string[];
  onChange: (ids: string[]) => void;
  error?: string | undefined;
};
export function Owners({ members, selected, onChange, error }: OwnersProps) {
  const id = useContext(FormScope) + '-ownerIds';
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={error ? id + '-error' : undefined}
      aria-invalid={error ? 'true' : undefined}
    >
      <legend>Owners</legend>
      <p>Choose at least one owner. Multiple owners means shared.</p>
      {members.map((member) => (
        <label className="owner-choice" key={member.id}>
          <input
            type="checkbox"
            checked={selected.includes(member.id)}
            onChange={(event) =>
              onChange(
                event.target.checked
                  ? [...selected, member.id]
                  : selected.filter((id) => id !== member.id),
              )
            }
          />
          {memberName(member)}
        </label>
      ))}
      {error && (
        <p id={id + '-error'} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
export function FormErrors({ message, errors }: { message: string; errors: FieldErrors }) {
  const scope = useContext(FormScope);
  const reference = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message) reference.current?.focus();
  }, [message]);
  if (!message) return null;
  return (
    <div role="alert" tabIndex={-1} ref={reference} className="form-error">
      <p>{message}</p>
      {Object.entries(errors).map(([field, error]) => (
        <p key={field}>
          <a
            href={'#' + scope + '-' + field}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(scope + '-' + field)?.focus();
            }}
          >
            {error}
          </a>
        </p>
      ))}
    </div>
  );
}
export function MemberNames({ members }: { members: Member[] }) {
  return (
    <ul className="owner-list">
      {members.map((member) => (
        <li key={member.id}>
          {member.name}
          {member.label !== null && <span className="member-label">Label: {member.label}</span>}
        </li>
      ))}
    </ul>
  );
}

export function FormActions({
  pending,
  label,
  cancel,
}: {
  pending: boolean;
  label: string;
  cancel?: () => void;
}) {
  return (
    <div className="actions">
      <button disabled={pending}>{label}</button>
      {cancel && (
        <button type="button" disabled={pending} onClick={cancel}>
          Cancel
        </button>
      )}
      {pending && <p role="status">Saving…</p>}
    </div>
  );
}
