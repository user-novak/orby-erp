import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { formatCurrency } from '../../core/utils/formatters';

interface ReceivableAccount {
  client: string;
  document: string;
  dueDate: string;
  status: string;
  amount: number;
}

@Component({
  selector: 'app-accounts-receivable',
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './accounts-receivable.html',
})
export class AccountsReceivable {
  readonly formatCurrency = formatCurrency;
  readonly columnHeaders: string[] = [
    'client',
    'document',
    'due_date',
    'status',
    'amount',
    'actions',
  ];

  readonly dataSource: ReceivableAccount[] = [
    {
      client: 'Comercial San José',
      document: 'Venta #1048',
      dueDate: '18/11/2026',
      status: 'Por vencer',
      amount: 1850,
    },
    {
      client: 'Distribuidora Norte',
      document: 'Venta #1041',
      dueDate: '10/11/2026',
      status: 'Vencida',
      amount: 920,
    },
  ];
}
