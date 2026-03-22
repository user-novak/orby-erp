import { Routes } from '@angular/router';
import { Sales } from './sales';
import { SalesIndex } from './sales-index/sales-index';
export const SALES_ROUTES: Routes = [
  {
    path: '',
    component: Sales,
    children: [
      {
        path: '',
        component: SalesIndex,
      },
    ],
  },
];
