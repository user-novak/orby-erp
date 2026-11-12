import { SALE_TYPE } from '../../biller/constants/fields';

export interface SalesFilters {
  date_from?: string;
  date_to?: string;
  client_id?: number;
  account_id?: number;
  product_id?: number;
  sale_type?: SALE_TYPE;
}
