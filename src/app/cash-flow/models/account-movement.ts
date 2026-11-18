import {
  ACCOUNT_MOVEMENT_STATUS,
  ACCOUNT_MOVEMENT_TYPE,
} from '../constants/account-movement';

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
}

export interface AccountMovementResourceResponse {
  data: AccountMovement;
}
