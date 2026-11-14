import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { formatCurrency } from '../../core/utils/formatters';

interface AccountSummary {
  name: string;
  reference: string;
  amount: number;
  icon: string;
}

type PendingStatusClass = 'status-warning' | 'status-danger' | 'status-info';

interface PendingAccount {
  name: string;
  document: string;
  dueDate: string;
  amount: number;
  status: string;
  statusClass: PendingStatusClass;
}

@Component({
  selector: 'app-cash-flow-index',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './cash-flow-index.html',
  styleUrl: './cash-flow-index.css',
})
export class CashFlowIndex {
  readonly formatCurrency = formatCurrency;

  readonly accounts: AccountSummary[] = [
    { name: 'Caja principal', reference: 'Efectivo', amount: 12450, icon: 'payments' },
    { name: 'Banco BCP', reference: '•••• 4821', amount: 8250, icon: 'account_balance' },
    { name: 'Caja secundaria', reference: 'Efectivo', amount: 3300, icon: 'wallet' },
  ];

  readonly receivables: PendingAccount[] = [
    {
      name: 'Comercial San José',
      document: 'Venta #1048',
      dueDate: '18/11/2026',
      amount: 1850,
      status: 'Por vencer',
      statusClass: 'status-warning',
    },
    {
      name: 'Distribuidora Norte',
      document: 'Venta #1041',
      dueDate: '10/11/2026',
      amount: 920,
      status: 'Vencida',
      statusClass: 'status-danger',
    },
  ];

  readonly payables: PendingAccount[] = [
    {
      name: 'Proveedor Central S.A.C.',
      document: 'Compra #302',
      dueDate: '20/11/2026',
      amount: 2400,
      status: 'Programada',
      statusClass: 'status-info',
    },
    {
      name: 'Transportes Lima',
      document: 'Servicio #158',
      dueDate: '15/11/2026',
      amount: 680,
      status: 'Pendiente',
      statusClass: 'status-warning',
    },
  ];

  get totalBalance(): number {
    return this.accounts.reduce((total, account) => total + account.amount, 0);
  }

  get totalReceivable(): number {
    return this.receivables.reduce((total, account) => total + account.amount, 0);
  }

  get totalPayable(): number {
    return this.payables.reduce((total, account) => total + account.amount, 0);
  }
}
