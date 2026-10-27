export interface Product {
  id?: number;
  description: string;
  brand: string;
  measure_unity: string;
  unit_price: number;
  percentage_distributor: number;
  price_distributor: number;
  percentage_major: number;
  price_major: number;
  percentage_general: number;
  price_general: number;
  stock: number;
}

export interface ProductExcel extends Record<string, unknown> {
  descripcion: string;
  marca: string;
  medida: string;
  precio_unitario: number;
  precio_general: number;
  stock: number;
}

export interface ProductFormValues {
  description: string;
  brand: string;
  measure_unity: string;
  unit_price: number;
  percentage_distributor: number;
  percentage_major: number;
  percentage_general: number;
  stock?: number;
}
