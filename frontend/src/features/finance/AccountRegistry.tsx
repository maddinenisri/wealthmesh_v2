import type { Account } from '../../api/financeContract';
import { MemberNames } from './FormControls';
import { dollars } from './presentation';

export function AccountRegistry({ accounts }: { accounts: Account[] }) {
  return (
    <table className="account-registry" role="table" aria-labelledby="accounts-heading">
      <thead role="rowgroup">
        <tr role="row">
          {['Account / Bank', 'Type', 'Owners', 'Balance (USD)', 'Balance date'].map((label) => (
            <th key={label} scope="col" role="columnheader">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </tbody>
    </table>
  );
}

function AccountRow({ account }: { account: Account }) {
  return (
    <tr role="row">
      <td role="cell" className="account-name">
        <a href={'/accounts/' + account.id}>{account.name}</a>
        <span className="account-bank">{account.bank ?? 'Bank not provided'}</span>
      </td>
      <td role="cell">
        <span className="mobile-label" aria-hidden="true">
          Type
        </span>
        Checking
      </td>
      <td role="cell">
        <span className="mobile-label" aria-hidden="true">
          Owners
        </span>
        <MemberNames members={account.owners} />
      </td>
      <td role="cell" className="account-amount">
        <span className="mobile-label" aria-hidden="true">
          Balance (USD)
        </span>
        {dollars(account.balance)}
        <span className="sr-only"> USD</span>
      </td>
      <td role="cell">
        <span className="mobile-label" aria-hidden="true">
          Balance date
        </span>
        <time dateTime={account.balanceDate}>{account.balanceDate}</time>
      </td>
    </tr>
  );
}
