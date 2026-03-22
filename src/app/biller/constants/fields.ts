import { Option } from '../../core/models/global';

export const SALES_OPTIONS_TYPES: Option[] = [
  { label: 'Al contado', value: 'ACO' },
  { label: 'Al credito', value: 'ACR' },
];

export type SALES_TYPES = 'ACO' | 'ACR';