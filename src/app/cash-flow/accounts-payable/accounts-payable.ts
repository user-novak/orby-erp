import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { formatCurrency } from '../../core/utils/formatters';

interface PayableAccount {
  provider: string;
  document: string;
  dueDate: string;
  status: string;
  amount: number;
}

@Component({
  selector: 'app-accounts-payable',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './accounts-payable.html',
})
export class AccountsPayable {
  readonly formatCurrency = formatCurrency;
  readonly columnHeaders: string[] = [
    'provider',
    'document',
    'due_date',
    'status',
    'amount',
    'actions',
  ];

  readonly dataSource: PayableAccount[] = [
    {
      provider: 'Proveedor Central S.A.C.',
      document: 'Compra #302',
      dueDate: '20/11/2026',
      status: 'Programada',
      amount: 2400,
    },
    {
      provider: 'Transportes Lima',
      document: 'Servicio #158',
      dueDate: '15/11/2026',
      status: 'Pendiente',
      amount: 680,
    },
  ];
}
