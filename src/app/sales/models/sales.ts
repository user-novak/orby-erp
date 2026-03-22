export interface SalesFilters {
  date_from?: string;
  date_to?: string;
  client_id?: number;
  account_id?: number;
  storage_id?: number;
  sale_type?: string;
  status?: 'pending' | 'paid';
  per_page?: number;
}
