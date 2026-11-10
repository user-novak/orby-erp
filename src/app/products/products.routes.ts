import { Routes } from '@angular/router';
import { Products } from './products';
import { ProductIndex } from './product-index/product-index';
import { ProductCreate } from './product-create/product-create';
import { ProductEdit } from './product-edit/product-edit';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: Products,
    children: [
      {
        path: '',
        component: ProductIndex,
      },
      {
        path: 'create',
        component: ProductCreate,
      },
      {
        path: 'edit/:id',
        component: ProductEdit,
      },
    ],
  },
];
