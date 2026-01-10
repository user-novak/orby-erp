import { Routes } from '@angular/router';
import { Clients } from './clients';
import { ClientIndex } from './client-index/client-index';
import { ClientEdit } from './client-edit/client-edit';
import { ClientCreate } from './client-create/client-create';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    component: Clients,
    children: [
      {
        path: '',
        component: ClientIndex,
      },
      {
        path: 'create',
        component: ClientCreate,
      },
      {
        path: 'edit',
        component: ClientEdit,
      },
    ],
  },
];
