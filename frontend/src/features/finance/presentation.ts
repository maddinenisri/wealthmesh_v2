import type { Member } from '../../api/financeContract';

export function dollars(amount: string): string {
  const negative = amount.startsWith('-');
  const unsigned = amount.replace(/^-/, '');
  const dot = unsigned.indexOf('.');
  const whole = unsigned.slice(0, dot);
  const cents = unsigned.slice(dot + 1);
  return `${negative ? '-' : ''}$${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${cents}`;
}
export function memberName(member: Member): string {
  return `Name: ${member.name}${member.label === null ? '' : `; Label: ${member.label}`}`;
}
export function normalized(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\p{White_Space}+/gu, ' ')
    .replace(/^ +| +$/g, '');
}
export function nullable(value: string): string | null {
  return normalized(value) || null;
}
// Used only to compare an uncertain draft with an authoritative saved response.
export function draftAmount(value: string): string | null {
  const cleaned = value.trim();
  if (!cleaned) return '0.00';
  if (!/^-?\$?(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+)(?:\.[0-9]{1,2})?$/.test(cleaned)) return null;
  const negative = cleaned.startsWith('-');
  const [whole, cents = ''] = cleaned.replace(/[-$,]/g, '').split('.');
  if (whole === undefined) return null;
  const digits = BigInt(whole).toString() + '.' + cents.padEnd(2, '0');
  return negative && digits !== '0.00' ? '-' + digits : digits;
}
