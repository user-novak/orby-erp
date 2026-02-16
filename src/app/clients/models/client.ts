export interface Client {
  dni: string;
  name: string;
  ruc?: string;
  phone?: string;
  address?: string;
}

export interface ClientExcel extends Record<string, unknown> {
  dni: string;
  nombre: string;
  ruc?: string;
  celular?: string;
  direccion?: string;
}

export interface ClientFormValues {
  name: string;
  dni?: string;
  ruc?: string;
  phone?: string;
  address?: string;
}
