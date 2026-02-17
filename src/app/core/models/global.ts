import { API_STATUS } from '../enums/global';
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

export type ConfirmDialogResult = 'accept' | 'cancel';
