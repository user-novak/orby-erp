import { Option } from '../../core/models/global';

export enum SALE_TYPE {
  CASH = 'contado',
  CREDIT = 'credito',
}

export enum PRICE_TIER {
  DISTRIBUTOR = 'distributor',
  MAJOR = 'major',
  GENERAL = 'general',
}

export const SALES_OPTIONS_TYPES: Option[] = [
  { label: 'Al contado', value: SALE_TYPE.CASH },
  { label: 'Al crédito', value: SALE_TYPE.CREDIT },
];

export const PRICE_TIER_OPTIONS: Option[] = [
  { label: 'Distribuidor', value: PRICE_TIER.DISTRIBUTOR },
  { label: 'Mayorista', value: PRICE_TIER.MAJOR },
  { label: 'U. final', value: PRICE_TIER.GENERAL },
];
