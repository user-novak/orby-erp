import {
  ACCOUNT_MOVEMENT_STATUS,
  ACCOUNT_MOVEMENT_TYPE,
} from '../constants/account-movement';
import { Account } from '../../accounts/models/account';
import { Category } from '../../categories/models/category';

export interface AccountMovementRequest {
  amount: number;
  movement_date: string;
  type: ACCOUNT_MOVEMENT_TYPE;
  status: ACCOUNT_MOVEMENT_STATUS;
  category_id: number;
  account_id?: number;
  description?: string;
}

export interface AccountMovement {
  id: number;
  amount: string;
  movement_date: string;
  type: ACCOUNT_MOVEMENT_TYPE;
  status: ACCOUNT_MOVEMENT_STATUS;
  description: string | null;
  category_id: number;
  account_id: number | null;
  biller_id: number | null;
  account: Account | null;
  category: Category;
}

export interface AccountMovementResourceResponse {
  data: AccountMovement;
}

export interface AccountMovementFilters {
  type?: ACCOUNT_MOVEMENT_TYPE;
  status?: ACCOUNT_MOVEMENT_STATUS;
}

export interface AccountPaymentRequest {
  account_id: number;
  amount: number;
  description?: string;
}
