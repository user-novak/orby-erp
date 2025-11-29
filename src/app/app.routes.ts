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
    path: 'storage',
    component: Storage,
  },
];
