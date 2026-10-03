export type StatusResult =
  | { kind: 'ready'; installationVersion: string }
  | { kind: 'unavailable' | 'network' | 'invalid' | 'timeout' };

function parseStatus(body: unknown): StatusResult {
  if (typeof body !== 'object' || body === null) return { kind: 'invalid' };
  if (!('status' in body) || body.status !== 'ready') return { kind: 'invalid' };
  if (!('installationVersion' in body)) return { kind: 'invalid' };
  if (typeof body.installationVersion !== 'string' || body.installationVersion.length === 0) {
    return { kind: 'invalid' };
  }
  return { kind: 'ready', installationVersion: body.installationVersion };
}

async function decodeStatus(response: Response): Promise<StatusResult> {
  try {
    const body: unknown = await response.json();
    return parseStatus(body);
  } catch {
    return { kind: 'invalid' };
  }
}

export async function readSystemStatus(signal: AbortSignal): Promise<StatusResult> {
  try {
    const response = await fetch(new URL('/api/system/status', window.location.origin), { signal });
    if (response.status === 503) return { kind: 'unavailable' };
    if (!response.ok) return { kind: 'invalid' };
    const result = await decodeStatus(response);
    return signal.aborted ? { kind: 'timeout' } : result;
  } catch {
    if (signal.aborted) return { kind: 'timeout' };
    return { kind: 'network' };
  }
}
