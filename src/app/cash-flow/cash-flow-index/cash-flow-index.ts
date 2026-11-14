import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { formatCurrency } from '../../core/utils/formatters';
import { AccountsPayable } from '../accounts-payable/accounts-payable';
import { AccountsReceivable } from '../accounts-receivable/accounts-receivable';
import { CashFlowMovement } from '../cash-flow-movement/cash-flow-movement';

interface AccountSummary {
  name: string;
  amount: number;
}

@Component({
  selector: 'app-cash-flow-index',
  imports: [MatTabsModule, CashFlowMovement, AccountsReceivable, AccountsPayable],
  templateUrl: './cash-flow-index.html',
})
export class CashFlowIndex {
  readonly formatCurrency = formatCurrency;

  readonly accounts: AccountSummary[] = [
    { name: 'Caja principal', amount: 12450 },
    { name: 'Banco BCP', amount: 8250 },
    { name: 'Caja secundaria', amount: 3300 },
  ];

  get totalBalance(): number {
    return this.accounts.reduce((total, account) => total + account.amount, 0);
  }
}
