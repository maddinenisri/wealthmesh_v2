export type Household = { id: string; name: string };
export type Member = Household & { label: string | null };
export type Account = {
  id: string;
  type: 'CHECKING';
  name: string;
  bank: string | null;
  owners: Member[];
  currency: 'USD';
  balance: string;
  balanceDate: string;
};
export type Overview = {
  household: Household | null;
  members: Member[];
  accounts: Account[];
  checkingTotal: { currency: 'USD'; amount: string };
  today: string;
  financialZone: string;
};
export type FieldErrors = Record<string, string>;
export type ErrorBody = { code: string; message: string; fieldErrors: FieldErrors };

export function object(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error('Unreadable response');
  return value as Record<string, unknown>;
}
export function text(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) throw new Error('Unreadable response');
  return value;
}
function nullableText(value: unknown): string | null {
  return value === null ? null : text(value);
}
export function uuid(value: unknown): string {
  const id = text(value);
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))
    throw new Error('Unreadable identifier');
  return id;
}
export function money(value: unknown): string {
  const amount = text(value);
  if (!/^-?(?:0|[1-9][0-9]*)\.[0-9]{2}$/.test(amount) || amount === '-0.00')
    throw new Error('Unreadable money');
  return amount;
}
export function date(value: unknown): string {
  const day = text(value);
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(day) || day.startsWith('0000'))
    throw new Error('Unreadable date');
  const parsed = new Date(day + 'T00:00:00Z');
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day)
    throw new Error('Unreadable date');
  return day;
}
function array<T>(value: unknown, parse: (entry: unknown) => T): T[] {
  if (!Array.isArray(value)) throw new Error('Unreadable list');
  return value.map(parse);
}
export function parseHousehold(value: unknown): Household {
  const data = object(value);
  return { id: uuid(data.id), name: text(data.name) };
}
export function parseMember(value: unknown): Member {
  const data = object(value);
  return { ...parseHousehold(data), label: nullableText(data.label) };
}
export function parseAccount(value: unknown): Account {
  const data = object(value);
  if (data.type !== 'CHECKING' || data.currency !== 'USD') throw new Error('Unsupported account');
  const owners = array(data.owners, parseMember);
  if (owners.length === 0 || new Set(owners.map((member) => member.id)).size !== owners.length)
    throw new Error('Unreadable owners');
  const balance = money(data.balance);
  if (balance.replace(/[-.]/g, '').length > 14) throw new Error('Unreadable account amount');
  return {
    id: uuid(data.id),
    type: 'CHECKING',
    name: text(data.name),
    bank: nullableText(data.bank),
    owners,
    currency: 'USD',
    balance,
    balanceDate: date(data.balanceDate),
  };
}
export function parseOverview(value: unknown): Overview {
  const data = object(value);
  const total = object(data.checkingTotal);
  if (total.currency !== 'USD') throw new Error('Unsupported currency');
  const household = data.household === null ? null : parseHousehold(data.household);
  const members = array(data.members, parseMember);
  const accounts = array(data.accounts, parseAccount);
  const amount = money(total.amount);
  if (household === null && (members.length || accounts.length || amount !== '0.00'))
    throw new Error('Unreadable household');
  return {
    household,
    members,
    accounts,
    checkingTotal: { currency: 'USD', amount },
    today: date(data.today),
    financialZone: text(data.financialZone),
  };
}
export function parseError(value: unknown): ErrorBody {
  const data = object(value);
  const fields = object(data.fieldErrors);
  return {
    code: text(data.code),
    message: text(data.message),
    fieldErrors: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, text(value)]),
    ),
  };
}

export function parseAccountFor(id: string) {
  return (value: unknown) => {
    const account = parseAccount(value);
    if (account.id.toLowerCase() !== id.toLowerCase())
      throw new Error('Unreadable account identity');
    return account;
  };
}
