import { API_STATUS } from '../enums/global';

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
export interface Option {
  label: string;
  value: string;
}
export interface ApiResponse<T> {
  status: API_STATUS;
  code: number;
  message: string;
  data: T;
}

export interface ConfirmDialogData {
  message: string;
  acceptText?: string;
  cancelText?: string;
}

export type DetailDialogValue = string | number | null | undefined;

export interface DetailDialogField {
  label: string;
  value: DetailDialogValue;
}

export interface DetailDialogSection {
  title: string;
  fields: DetailDialogField[];
}

export interface DetailDialogColumn {
  key: string;
  label: string;
}

export interface DetailDialogTable {
  title: string;
  columns: DetailDialogColumn[];
  rows: Record<string, DetailDialogValue>[];
}

export interface DetailDialogData {
  title: string;
  sections: DetailDialogSection[];
  tables?: DetailDialogTable[];
  closeText?: string;
}

export interface NotificationData {
  message: string;
  icon?: string;
  backgroundColor?: string;
  actionText?: string;
}

export type ConfirmDialogResult = 'accept' | 'cancel';
