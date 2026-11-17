import { Routes } from '@angular/router';
import { Categories } from './categories';
import { CategoryIndex } from './category-index/category-index';
import { CategoryCreate } from './category-create/category-create';
import { CategoryEdit } from './category-edit/category-edit';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: Categories,
    children: [
      {
        path: '',
        component: CategoryIndex,
      },
      {
        path: 'create',
        component: CategoryCreate,
      },
      {
        path: 'edit/:id',
        component: CategoryEdit,
      },
    ],
  },
];
