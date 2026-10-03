import { useEffect, useState } from 'react';
export function useRead<T>(read: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    failed: boolean;
    error: unknown;
  }>({
    data: null,
    loading: true,
    failed: false,
    error: null,
  });
  useEffect(() => {
    let active = true;
    read()
      .then((data) => {
        if (active) setState({ data, loading: false, failed: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState((previous) => ({ ...previous, loading: false, failed: true, error }));
      });
    return () => {
      active = false;
    };
  }, [read, attempt]);
  return {
    ...state,
    retry: () => {
      setState((previous) => ({ ...previous, loading: true, failed: false, error: null }));
      setAttempt((previous) => previous + 1);
    },
  };
}
