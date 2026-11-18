import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { Account } from '../../accounts/models/account';
import { AccountService } from '../../accounts/services/account';
import { NotificationData } from '../../core/models/global';
import { LoaderService, NotificationService } from '../../core/services';
import { formatCurrency } from '../../core/utils/formatters';
import { AccountsPayable } from '../accounts-payable/accounts-payable';
import { AccountsReceivable } from '../accounts-receivable/accounts-receivable';
import { CashFlowMovement } from '../cash-flow-movement/cash-flow-movement';

@Component({
  selector: 'app-cash-flow-index',
  imports: [MatTabsModule, CashFlowMovement, AccountsReceivable, AccountsPayable],
  templateUrl: './cash-flow-index.html',
})
export class CashFlowIndex implements OnInit {
  readonly formatCurrency = formatCurrency;

  @ViewChild(AccountsReceivable) private accountsReceivable?: AccountsReceivable;
  @ViewChild(AccountsPayable) private accountsPayable?: AccountsPayable;

  accounts: Account[] = [];

  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    this.loadAccounts();
  }

  get totalBalance(): number {
    return this.accounts.reduce((total, account) => total + Number(account.amount), 0);
  }

  handleMovementCreated(): void {
    this.loadAccounts();
    this.accountsReceivable?.refresh();
    this.accountsPayable?.refresh();
  }

  handleBalanceChanged(): void {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.loaderService.show();
    this.accountService
      .getAllAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (accounts) => {
          this.accounts = accounts;
          this.loaderService.hide();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification(
              'Error al cargar los saldos de las cuentas',
              'error',
              '#f44336',
            ),
            3000,
          );
        },
      });
  }

  private generateNotification(
    message: string,
    icon: string,
    backgroundColor: string,
  ): NotificationData {
    return {
      message,
      icon,
      backgroundColor,
    };
  }

  private showNotification(notification: NotificationData, duration?: number): void {
    this.notification.show(notification, duration);
  }
}
