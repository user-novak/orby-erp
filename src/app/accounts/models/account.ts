export interface Account {
  account_number: string;
  name: string;
  description: string;
  amount: number;
}

export interface AccountExcel extends Record<string, unknown> {
  numeroCuenta: string;
  nombreCuenta: string;
  descripcion: string;
  monto: number;
}
