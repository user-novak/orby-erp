import { Routes } from '@angular/router';
import { Biller } from './biller/biller';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'biller',
    component: Biller,
  },
  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.routes').then((m) => m.STORAGE_ROUTES),
  },
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.routes').then((m) => m.ACCOUNTS_ROUTES),
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.routes').then((m) => m.SALES_ROUTES),
  },
  {
    path: 'cash_flow',
    loadChildren: () => import('./cash-flow/cash_flow.routes').then((m) => m.CASH_FLOW_ROUTES),
  },
];
