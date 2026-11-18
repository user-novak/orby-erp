import { Option } from '../../core/models/global';

export enum ACCOUNT_MOVEMENT_TYPE {
  INCOME = 'ingreso',
  EXPENSE = 'egreso',
}

export enum ACCOUNT_MOVEMENT_STATUS {
  COLLECTED = 'cuenta_cobrada',
  PAID = 'cuenta_pagada',
  RECEIVABLE = 'cuenta_por_cobrar',
  PAYABLE = 'cuenta_por_pagar',
}

export const ACCOUNT_MOVEMENT_TYPE_OPTIONS: Option[] = [
  { label: 'Ingreso', value: ACCOUNT_MOVEMENT_TYPE.INCOME },
  { label: 'Egreso', value: ACCOUNT_MOVEMENT_TYPE.EXPENSE },
];

export const INCOME_STATUS_OPTIONS: Option[] = [
  { label: 'Cuenta cobrada', value: ACCOUNT_MOVEMENT_STATUS.COLLECTED },
  { label: 'Cuenta por cobrar', value: ACCOUNT_MOVEMENT_STATUS.RECEIVABLE },
];

export const EXPENSE_STATUS_OPTIONS: Option[] = [
  { label: 'Cuenta pagada', value: ACCOUNT_MOVEMENT_STATUS.PAID },
  { label: 'Cuenta por pagar', value: ACCOUNT_MOVEMENT_STATUS.PAYABLE },
];

export const SETTLED_ACCOUNT_MOVEMENT_STATUSES: ACCOUNT_MOVEMENT_STATUS[] = [
  ACCOUNT_MOVEMENT_STATUS.COLLECTED,
  ACCOUNT_MOVEMENT_STATUS.PAID,
];
