export interface Storage {
  code: string;
  description: string;
  brand: string;
  measure: string;
  unit_price: number;
  general_price: number;
  stock: number;
}

export interface StorageExcel extends Record<string, unknown> {
  codigo: string;
  descripcion: string;
  marca: string;
  medida: string;
  precio_unitario: number;
  precio_general: number;
  stock: number;
}
