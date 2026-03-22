import { StorageExcel, Storage } from '../models/storage';

export class StorageExcelMapper {
  static normalizeExcelRow(raw: Record<string, unknown>): StorageExcel {
    const normalized = {
      descripcion: toString(raw['descripcion']) ?? '',
      marca: toString(raw['marca']) ?? '',
      medida: toString(raw['medida']) ?? '',
      precio_unitario: toNumber(raw['precio_unitario']) ?? 0,
      precio_general: toNumber(raw['precio_general']) ?? 0,
      stock: toNumber(raw['stock']) ?? 0,
    } satisfies StorageExcel;

    return normalized;
  }

  static toStorageItem(row: StorageExcel): Storage {
    return {
      description: row.descripcion,
      brand: row.marca,
      measure_unity: row.medida,
      unit_price: row.precio_unitario,
      price_general: row.precio_general,
      price_distributor: row.precio_unitario,
      price_major: row.precio_unitario,
      stock: row.stock,
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
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'));
    return isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}
