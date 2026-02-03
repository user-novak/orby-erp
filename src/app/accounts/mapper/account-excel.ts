import { Account, AccountExcel } from '../models/account';

export class AccountExcelMapper {
  static normalizeExcelRow(raw: Record<string, unknown>): AccountExcel {
    const normalized = {
      numeroCuenta: toString(raw['numeroCuenta']) ?? '',
      nombreCuenta: toString(raw['nombreCuenta']) ?? '',
      tipoCuenta: toString(raw['tipoCuenta']) ?? '',
      monto: toNumber(raw['monto']) ?? 0,
    } satisfies AccountExcel;

    return normalized;
  }

  static toAccount(row: AccountExcel): Account {
    return {
      accountNumber: row.numeroCuenta,
      accountName: row.nombreCuenta,
      accountType: row.tipoCuenta,
      amount: row.monto,
    };
  }
}
export function toString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return undefined;
}

export function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'));
    return isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}
