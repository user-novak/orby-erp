import { Account } from '../../accounts/models/account';
import { Client } from '../../clients/models/client';
import { Storage } from '../../storage/models/storage';
import { SALES_TYPES } from '../constants/fields';

export interface GeneralInfoBillerForm {
  sale_date: string;
  client_id: string;
  client: string;
  sale_type: SALES_TYPES;
  account_id: string;
  payment_date?: string;
  place?: string;
}

export interface BillerForm {
  quantity: number;
  measure_unity: string;
  storage_id: string;
  unit_price: number;
  total_price: number;
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
  payment_date?: string;
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
