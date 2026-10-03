import { parseAccountFor, parseError, parseOverview, type ErrorBody } from './financeContract';

export class ResponseFailure extends Error {
  constructor(
    message: string,
    public readonly requestId: string | null,
  ) {
    super(message);
  }
}
export class ApiFailure extends ResponseFailure {
  constructor(
    public readonly body: ErrorBody,
    public readonly status: number,
    requestId: string | null,
  ) {
    super(body.message, requestId);
  }
}
async function readResponse<T>(response: Response, parse: (value: unknown) => T): Promise<T> {
  const reference = response.headers.get('X-Request-Id');
  try {
    const value: unknown = await response.json();
    if (!response.ok) throw new ApiFailure(parseError(value), response.status, reference);
    return parse(value);
  } catch (failure) {
    if (failure instanceof ApiFailure) throw failure;
    throw new ResponseFailure('The local server returned an unreadable response.', reference);
  }
}
export async function request<T>(
  path: string,
  parse: (value: unknown) => T,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(new URL(path, window.location.origin), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? null : JSON.stringify(body),
      signal: controller.signal,
    });
    return await readResponse(response, parse);
  } finally {
    window.clearTimeout(timer);
  }
}
export const readOverview = () => request('/api/household', parseOverview);
export const readAccount = (id: string) => request('/api/accounts/' + id, parseAccountFor(id));
