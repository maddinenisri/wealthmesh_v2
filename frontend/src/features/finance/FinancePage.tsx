import { useMemo } from 'react';
import { readOverview, readAccount, ApiFailure, ResponseFailure } from '../../api/finance';
import type { Overview } from '../../api/financeContract';
import { CheckingForm } from './CheckingForm';
import { CreateHousehold } from './HouseholdForms';
import { HouseholdPage } from './HouseholdPage';
import { Heading, type Navigate } from './Navigation';
import { AccountDetail, OverviewPage } from './OverviewPage';
import { useRead } from './useRead';

function SavedAccountPage({
  id,
  edit,
  overview,
  navigate,
}: {
  id: string;
  edit: boolean;
  overview: Overview;
  navigate: Navigate;
}) {
  const read = useMemo(() => () => readAccount(id), [id]);
  const state = useRead(read);
  if (state.loading && !state.data) return <p role="status">Loading checking account…</p>;
  if (!state.data) return <MissingAccount retry={state.retry} failure={state.error} />;
  return (
    <>
      {state.failed && (
        <p role="alert">
          Last loaded information; refresh failed. <button onClick={state.retry}>Retry</button>
        </p>
      )}
      {state.failed && <RequestReference failure={state.error} />}
      {edit ? (
        <CheckingForm account={state.data} overview={overview} navigate={navigate} />
      ) : (
        <AccountDetail account={state.data} />
      )}
    </>
  );
}
export function FinancePage({ path, navigate }: { path: string; navigate: Navigate }) {
  const state = useRead(readOverview);
  if (state.loading && !state.data) return <p role="status">Loading household…</p>;
  if (!state.data)
    return (
      <>
        <Heading>Household unavailable</Heading>
        <p role="alert">We couldn't load your household. Try again.</p>
        <RequestReference failure={state.error} />
        <button onClick={state.retry}>Retry</button>
      </>
    );
  const overview = state.data;
  if (overview.household === null)
    return (
      <>
        <Heading>Set up your household</Heading>
        <CreateHousehold navigate={navigate} />
      </>
    );
  return (
    <>
      {state.loading && <p role="status">Refreshing household…</p>}
      {state.failed && (
        <p role="alert">
          Last loaded information; refresh failed. <button onClick={state.retry}>Retry</button>
        </p>
      )}
      {state.failed && <RequestReference failure={state.error} />}
      <FinanceRoutes path={path} overview={overview} navigate={navigate} refresh={state.retry} />
    </>
  );
}
function FinanceRoutes({
  path,
  overview,
  navigate,
  refresh,
}: {
  path: string;
  overview: Overview;
  navigate: Navigate;
  refresh: () => void;
}) {
  if (path === '/') return <OverviewPage overview={overview} />;
  if (path === '/household')
    return <HouseholdPage overview={overview} navigate={navigate} refresh={refresh} />;
  if (path === '/accounts/new') return <ChooseAccount />;
  if (path === '/accounts/new/checking')
    return <CheckingForm overview={overview} navigate={navigate} />;
  const route = /^\/accounts\/([0-9a-f-]{36})(\/edit)?$/i.exec(path);
  const id = route?.[1];
  if (id)
    return (
      <SavedAccountPage
        id={id}
        edit={route?.[2] !== undefined}
        overview={overview}
        navigate={navigate}
      />
    );
  return (
    <>
      <Heading>Page not found</Heading>
      <a href="/">Back to overview</a>
    </>
  );
}

function MissingAccount({ retry, failure }: { retry: () => void; failure: unknown }) {
  const missing = failure instanceof ApiFailure && failure.status === 404;
  const title = missing ? "This account couldn't be found" : 'Checking account unavailable';
  return (
    <>
      <Heading>{title}</Heading>
      <p role="alert">
        {missing
          ? "This account couldn't be found"
          : "We couldn't load this checking account. Try again."}
      </p>
      <RequestReference failure={failure} />
      {!missing && <button onClick={retry}>Retry</button>}
      <p>
        <a href="/">Back to accounts</a>
      </p>
    </>
  );
}
function RequestReference({ failure }: { failure: unknown }) {
  if (!(failure instanceof ResponseFailure) || !failure.requestId) return null;
  return <p>Request reference: {failure.requestId}</p>;
}
function ChooseAccount() {
  return (
    <>
      <Heading>Add account</Heading>
      <a className="button-link" href="/accounts/new/checking">
        Checking
      </a>
      <p>Add a checking account with its starting balance.</p>
      <p>Other account types will be added later.</p>
      <a href="/" data-return-focus="add-account">
        Cancel
      </a>
    </>
  );
}
