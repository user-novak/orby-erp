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
];
