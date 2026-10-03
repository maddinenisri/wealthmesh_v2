import type { Account, Overview } from '../../api/financeContract';
import { MemberNames } from './FormControls';
import { Heading } from './Navigation';
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
      <dt>Balance</dt>
      <dd>{dollars(account.balance)} USD</dd>
      <dt>Balance date</dt>
      <dd>
        <time dateTime={account.balanceDate}>{account.balanceDate}</time>
      </dd>
    </dl>
  );
}
export function OverviewPage({ overview }: { overview: Overview }) {
  return (
    <>
      <Heading>{overview.household?.name ?? 'Household'}</Heading>
      <section className="total">
        <h2>Checking total (USD)</h2>
        <p className="money">{dollars(overview.checkingTotal.amount)}</p>
        <p>Includes checking accounts only. Shared accounts are counted once.</p>
      </section>
      <div className="section-heading">
        <h2>Accounts</h2>
        <a id="add-account" className="button-link" href="/accounts/new">
          Add account
        </a>
      </div>
      {overview.accounts.length === 0 ? (
        <p>
          No accounts added yet. Start with a checking account.{' '}
          <a href="/household">Add household members</a> to choose owners.
        </p>
      ) : (
        <ul className="accounts">
          {overview.accounts.map((account) => (
            <li key={account.id}>
              <h3>
                <a href={'/accounts/' + account.id}>{account.name}</a>
              </h3>
              <AccountFacts account={account} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export function AccountDetail({ account }: { account: Account }) {
  return (
    <>
      <a href="/">Back to accounts</a>
      <Heading>{account.name}</Heading>
      <AccountFacts account={account} />
      <a id="edit-account" className="button-link" href={'/accounts/' + account.id + '/edit'}>
        Edit account
      </a>
      <p>This balance comes from the starting amount entered when this account was created.</p>
      <h2>Activity</h2>
      <p>
        No money activity has been recorded. Recording money in, money out and transfers will be
        added later.
      </p>
      <p>Changing the balance is not available in this feature.</p>
    </>
  );
}
