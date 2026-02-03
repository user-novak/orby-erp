import { Routes } from '@angular/router';
import { Accounts } from './accounts';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    component: Accounts,
    children: [],
  },
];
