import { Option } from '../../core/models/global';

export enum CATEGORY_TYPE {
  INCOME = 'ingreso',
  EXPENSE = 'egreso',
  BOTH = 'ambos',
}

export enum CATEGORY_STATUS {
  ACTIVE = 'activo',
  INACTIVE = 'inactivo',
}

export const CATEGORY_TYPE_OPTIONS: Option[] = [
  { label: 'Ingreso', value: CATEGORY_TYPE.INCOME },
  { label: 'Egreso', value: CATEGORY_TYPE.EXPENSE },
  { label: 'Ambos', value: CATEGORY_TYPE.BOTH },
];

export const CATEGORY_STATUS_OPTIONS: Option[] = [
  { label: 'Activo', value: CATEGORY_STATUS.ACTIVE },
  { label: 'Inactivo', value: CATEGORY_STATUS.INACTIVE },
];

export const CATEGORY_COLUMN_HEADERS: string[] = ['name', 'type', 'status', 'actions'];
