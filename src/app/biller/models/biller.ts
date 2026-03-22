import { Account } from '../../accounts/models/account';
import { Client } from '../../clients/models/client';
import { Storage } from '../../storage/models/storage';
import { SALES_TYPES } from '../constants/fields';

export interface GeneralInfoBillerForm {
  registerDate: string;
  clientType: string;
  client: string;
  saleType: SALES_TYPES;
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

export interface BillerRequest {
  subtotal: number;
  igv: number;
  total: number;
  sale_date: string;
  sale_type: SALES_TYPES;
  client_id: number;
  account_id: number;
  items: BillerItem[];
  place?: string;
}

export interface BillerItem {
  quantity: number;
  unit_price: number;
  storage_id: number;
}

export interface BillerResponse {
  id: number;
  sale_date: string;
  sale_type: string;
  subtotal: number;
  igv: number;
  total: number;
  client_id: number;
  account_id: number;
  place?: string;
  items: BillerItemResponse[];
}

export interface BillerItemResponse {
  id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  storage_id: number;
  storage: Storage;
}
