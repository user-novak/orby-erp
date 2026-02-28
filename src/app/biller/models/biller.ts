import { Account } from '../../accounts/models/account';
import { Client } from '../../clients/models/client';
import { Storage } from '../../storage/models/storage';

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

export interface BillerData {
  clients: Client[];
  storages: Storage[];
  accounts: Account[];
}
