import { useCallback, useEffect, useState } from 'react';
import { readSystemStatus, type StatusResult } from '../../api/systemStatus';

type StatusState = StatusResult | { kind: 'loading' };

export function useSystemStatus(timeoutMs: number) {
  const [state, setState] = useState<StatusState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setState({ kind: 'loading' });
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    void readSystemStatus(controller.signal).then((result) => {
      if (active) setState(result);
      window.clearTimeout(timeout);
    });
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt, timeoutMs]);

  return { state, retry };
}
