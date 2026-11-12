import { Account } from '../../accounts/models/account';
import { Client } from '../../clients/models/client';
import { Product } from '../../products/models/product';
import { PRICE_TIER, SALE_TYPE } from '../constants/fields';

export interface GeneralInfoBillerForm {
  sale_date: Date;
  client_id: number;
  sale_type: SALE_TYPE;
  account_id: number | null;
  payment_date?: Date | null;
  initial_payment?: number | null;
  include_igv: boolean;
  igv_percentage: number;
}

export interface BillerForm {
  quantity: number;
  measure_unity: string;
  product_id: number;
  price_tier: PRICE_TIER;
  unit_price: number;
  total_price: number;
}

export interface BillerData {
  clients: Client[];
  products: Product[];
  accounts: Account[];
}

export interface BillerDataSalesResponse {
  id: number;
  sale_date: string;
  sale_type: SALE_TYPE;
  subtotal: number;
  igv: number;
  igv_percentage: number | null;
  total: number;
  client_id: number;
  account_id: number;
  place: string;
  payment_date: string;
  account: Account;
  client: Client;
  items: BillerDataSalesItemResponse[];
}

export interface BillerDataSalesItemResponse {
  id: number;
  biller_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  storage: Product;
}

export interface BillerRequest {
  subtotal: number;
  igv?: number;
  igv_percentage?: number;
  total: number;
  sale_date: string;
  sale_type: SALE_TYPE;
  client_id: number;
  account_id?: number | null;
  items: BillerItem[];
  payment_date?: string | null;
  initial_payment?: number | null;
}

export interface BillerItem {
  quantity: number;
  product_id: number;
  price_tier: PRICE_TIER;
  unit_price: number;
}

export interface BillerResponse {
  id: number;
  sale_date: string;
  payment_date: string | null;
  sale_type: SALE_TYPE;
  subtotal: number;
  igv: number;
  igv_percentage: number | null;
  total: number;
  client_id: number;
  account_id: number | null;
  client: Client;
  account: Account | null;
  items: BillerItemResponse[];
  account_movements: AccountMovementResponse[];
  created_at: string;
}

export interface BillerItemResponse {
  id: number;
  biller_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: Product;
}

export interface AccountMovementResponse {
  id: number;
  amount: number;
  movement_date: string;
  type: string;
  status: string;
  description: string;
  account_id: number | null;
  biller_id: number;
  account: Account | null;
}

export interface BillerResourceResponse {
  data: BillerResponse;
}
