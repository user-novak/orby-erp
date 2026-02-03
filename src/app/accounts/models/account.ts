export interface Account {
  accountNumber: string;
  accountName: string;
  accountType: string;
  amount: number;
}

export interface AccountExcel extends Record<string, unknown> {
  numeroCuenta: string;
  nombreCuenta: string;
  tipoCuenta: string;
  monto: number;
}
