import { Routes } from '@angular/router';
import { Biller } from './biller/biller';
import { Home } from './home/home';
import { Storage } from './storage/storage';

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
];
