export interface GeneralInfoBillerForm {
  registerDate: string;
  clientType: string;
  client: string;
  saleType: string;
  account: string;
  paymentDate?: string;
  place?: string;
}

export interface BillerForm {
  quantity: number;
  measureUnity: string;
  productDescription: string;
  unitPrice: number;
  totalPrice: number;
}
