import { Routes } from '@angular/router';
import { CashFlow } from './cash-flow';
import { CashFlowIndex } from './cash-flow-index/cash-flow-index';

export const CASH_FLOW_ROUTES: Routes = [
  {
    path: '',
    component: CashFlow,
    children: [
      {
        path: '',
        component: CashFlowIndex,
      },
    ],
  },
];
