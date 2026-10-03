import { RequestFailure } from '../../components/RequestFailure';
import { useSystemStatus } from './useSystemStatus';

const failures = {
  unavailable: {
    title: 'Setup is unavailable',
    message: 'The local server cannot read its setup record. Check the database, then try again.',
  },
  network: {
    title: 'Cannot reach the local server',
    message: 'Check that WealthMesh is running, then try again.',
  },
  invalid: {
    title: 'Unexpected response',
    message:
      'The local server returned an unreadable setup status. Check the server logs, then try again.',
  },
  timeout: {
    title: 'Request timed out',
    message:
      'The local server took too long to respond. Check the server and database, then try again.',
  },
};

export function SetupStatus({ timeoutMs = 5000 }: { timeoutMs?: number }) {
  const { state, retry } = useSystemStatus(timeoutMs);
  if (state.kind === 'loading') return <p role="status">Checking setup…</p>;
  if (state.kind === 'ready') {
    return (
      <section className="ready" aria-labelledby="ready-heading">
        <p className="eyebrow">Local system check</p>
        <h2 id="ready-heading">Setup ready</h2>
        <p>Installation version {state.installationVersion}</p>
        <p>The application read its installation record from PostgreSQL.</p>
      </section>
    );
  }
  return <RequestFailure {...failures[state.kind]} retry={retry} />;
}
