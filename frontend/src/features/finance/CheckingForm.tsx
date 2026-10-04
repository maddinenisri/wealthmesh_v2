import { type Account, type Overview } from '../../api/financeContract';
import { Field, FormErrors, Owners, FormActions, FinanceForm } from './FormControls';
import { Heading, type Navigate } from './Navigation';
import { useCheckingDraft, type CheckingDraft } from './useCheckingDraft';

export function CheckingForm({
  overview,
  account,
  navigate,
}: {
  overview: Overview;
  account?: Account;
  navigate: Navigate;
}) {
  const draft = useCheckingDraft(overview, account, navigate);
  if (overview.members.length === 0) return <NoMembers />;
  return (
    <>
      <Heading>{account ? 'Edit account' : 'Add checking account'}</Heading>
      <p>
        {account
          ? 'These changes leave the balance and balance date unchanged.'
          : 'The starting amount you already have. This does not record income.'}
      </p>
      <FinanceForm className="panel form-panel" onSubmit={draft.submit} noValidate>
        <FormErrors message={draft.save.message} errors={draft.save.errors} />
        <AccountFields draft={draft} overview={overview} />
        {!account && <OpeningFields draft={draft} zone={overview.financialZone} />}
        <FormActions
          pending={draft.save.pending}
          label={account ? 'Save account details' : 'Save checking account'}
          cancel={() =>
            navigate(
              account ? '/accounts/' + account.id : '/',
              '',
              account ? 'edit-account' : 'add-account',
            )
          }
        />
      </FinanceForm>
    </>
  );
}
function NoMembers() {
  return (
    <>
      <Heading>Add checking</Heading>
      <p>Add a household member before creating checking so you can choose an owner.</p>
      <a href="/household">Go to Household</a>
      <p>
        <a href="/" data-return-focus="add-account">
          Cancel
        </a>
      </p>
    </>
  );
}
function AccountFields({ draft, overview }: { draft: CheckingDraft; overview: Overview }) {
  return (
    <>
      <Field
        name="name"
        label="Name"
        required
        value={draft.name}
        onChange={draft.setName}
        error={draft.save.errors.name}
      />
      <Owners
        members={overview.members}
        selected={draft.ownerIds}
        onChange={draft.setOwners}
        error={draft.save.errors.ownerIds}
      />
      <Field
        name="bank"
        label="Bank (optional)"
        value={draft.bank}
        onChange={draft.setBank}
        error={draft.save.errors.bank}
      />
    </>
  );
}
function OpeningFields({ draft, zone }: { draft: CheckingDraft; zone: string }) {
  return (
    <>
      <Field
        name="openingAmount"
        label="Balance (USD, optional)"
        value={draft.amount}
        onChange={draft.setAmount}
        error={draft.save.errors.openingAmount}
        help="Leave blank for $0.00. Use up to two decimal places, for example 5000.00 or $5,000.00. A minus means an overdraft. Enter an amount between -$999,999,999,999.99 and $999,999,999,999.99. More than two decimal places is rejected without rounding."
      />
      <Field
        name="balanceDate"
        label="Balance date"
        required
        value={draft.balanceDate}
        onChange={draft.setDate}
        type="date"
        error={draft.save.errors.balanceDate}
        help={
          'Date this starting balance applies to. Today or an earlier date. Computer zone: ' + zone
        }
      />
    </>
  );
}
