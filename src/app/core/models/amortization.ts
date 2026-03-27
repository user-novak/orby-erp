export interface Amortization {
  id: number;
  biller_payment_id: number;
  client_id: number;
  amount: number;
  payment_date: string;
}

export interface AmortizationRequest {
  amount: number;
  payment_date?: string;
}
