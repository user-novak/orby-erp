import { Routes } from '@angular/router';
import { Accounts } from './accounts';
import { AccountIndex } from './account-index/account-index';
import { AccountCreate } from './account-create/account-create';
import { AccountEdit } from './account-edit/account-edit';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    component: Accounts,
    children: [
      {
        path: '',
        component: AccountIndex,
      },
      {
        path: 'create',
        component: AccountCreate,
      },
      {
        path: 'edit/:id',
        component: AccountEdit,
      },
    ],
  },
];
