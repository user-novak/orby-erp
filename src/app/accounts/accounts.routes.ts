import { Routes } from '@angular/router';
import { Accounts } from './accounts';
import { AccountIndex } from './account-index/account-index';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    component: Accounts,
    children: [
      {
        path: '',
        component: AccountIndex,
      },
    ],
  },
];
