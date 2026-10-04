import type { Account, Overview } from '../../api/financeContract';
import { MemberNames } from './FormControls';
import { Heading } from './Navigation';
import { AccountRegistry } from './AccountRegistry';
import { dollars } from './presentation';

export function AccountFacts({ account }: { account: Account }) {
  return (
    <dl>
      <dt>Type</dt>
      <dd>Checking</dd>
      <dt>Owners</dt>
      <dd>
        <MemberNames members={account.owners} />
      </dd>
      <dt>Bank</dt>
      <dd>{account.bank ?? 'Bank not provided'}</dd>
    </dl>
  );
}
export function OverviewPage({ overview }: { overview: Overview }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <Heading>{overview.household?.name ?? 'Household'}</Heading>
          <p className="page-subtitle">Household overview</p>
        </div>
        <a id="add-account" className="button-link" href="/accounts/new/checking">
          Add checking account
        </a>
      </div>
      <section className="panel total">
        <h2>Checking total (USD)</h2>
        <p className="money">{dollars(overview.checkingTotal.amount)}</p>
        <p className="helper">Includes checking accounts only. Shared accounts are counted once.</p>
      </section>
      <section className="panel accounts-panel" aria-labelledby="accounts-heading">
        <h2 id="accounts-heading">Accounts</h2>
        {overview.accounts.length === 0 ? (
          <p>
            No accounts added yet. Start with a checking account.{' '}
            <a href="/household">Add household members</a> to choose owners.
          </p>
        ) : (
          <AccountRegistry accounts={overview.accounts} />
        )}
      </section>
    </>
  );
}
export function AccountDetail({ account }: { account: Account }) {
  return (
    <>
      <a href="/">Back to accounts</a>
      <Heading>{account.name}</Heading>
      <section className="panel total" aria-label="Account balance">
        <h2>Balance (USD)</h2>
        <p className="money">{dollars(account.balance)} USD</p>
        <p>
          Balance date: <time dateTime={account.balanceDate}>{account.balanceDate}</time>
        </p>
      </section>
      <section className="panel account-detail" aria-label="Account details">
        <AccountFacts account={account} />
        <a id="edit-account" className="button-link" href={'/accounts/' + account.id + '/edit'}>
          Edit account
        </a>
      </section>
      <p className="helper">
        This balance comes from the starting amount entered when this account was created.
      </p>
      <h2 className="activity-heading">Activity</h2>
      <p>
        No money activity has been recorded. Recording money in, money out and transfers will be
        added later.
      </p>
      <p>Changing the balance is not available in this feature.</p>
    </>
  );
}
