import { Routes } from '@angular/router';
import { Storage } from './storage';
import { StorageIndex } from './storage-index/storage-index';
import { StorageCreate } from './storage-create/storage-create';
import { StorageEdit } from './storage-edit/storage-edit';

export const STORAGE_ROUTES: Routes = [
  {
    path: '',
    component: Storage,
    children: [
      {
        path: '',
        component: StorageIndex,
      },
      {
        path: 'create',
        component: StorageCreate,
      },
      {
        path: 'edit',
        component: StorageEdit,
      },
    ],
  },
];
