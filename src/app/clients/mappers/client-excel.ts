import { ClientExcel, Client } from '../models/client';

export class ClientExcelMapper {
  static normalizeExcelRow(raw: Record<string, unknown>): ClientExcel {
    const normalized = {
      dni: toString(raw['dni']) ?? '',
      nombre: toString(raw['nombre']) ?? '',
      ruc: toString(raw['ruc']),
      celular: toString(raw['celular']),
      direccion: toString(raw['direccion']),
    } satisfies ClientExcel;

    return normalized;
  }

  static toClient(row: ClientExcel): Client {
    return {
      dni: row.dni,
      name: row.nombre,
      ruc: row.ruc,
      phone: row.celular,
      address: row.direccion,
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
