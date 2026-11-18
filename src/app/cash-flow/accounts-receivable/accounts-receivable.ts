import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { Account } from '../../accounts/models/account';
import { AccountService } from '../../accounts/services/account';
import { NoData } from '../../core/components/no-data/no-data';
import { NotificationData, PaginatedResponse } from '../../core/models/global';
import { LoaderService, NotificationService } from '../../core/services';
import { formatCurrency, formatDate } from '../../core/utils/formatters';
import {
  ACCOUNT_MOVEMENT_STATUS,
  ACCOUNT_MOVEMENT_TYPE,
} from '../constants/account-movement';
import { AccountCollectionRequest, AccountMovement } from '../models/account-movement';
import { AccountMovementService } from '../services/account-movement';
import {
  AccountCollectionDialog,
  AccountCollectionDialogData,
} from './account-collection-dialog/account-collection-dialog';

@Component({
  selector: 'app-accounts-receivable',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    NoData,
  ],
  templateUrl: './accounts-receivable.html',
})
export class AccountsReceivable implements OnInit {
  @Output() balanceChanged = new EventEmitter<void>();

  readonly columnHeaders: string[] = [
    'movement_date',
    'category',
    'description',
    'amount',
    'actions',
  ];
  readonly dataSource = new MatTableDataSource<AccountMovement>([]);

  accounts: Account[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  private readonly accountMovementService = inject(AccountMovementService);
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly loaderService = inject(LoaderService);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    this.loadData();
  }

  formatAmount(value: string): string {
    return formatCurrency(Number(value));
  }

  formatMovementDate(value: string): string {
    return formatDate(value);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  refresh(): void {
    this.loadData();
  }

  openCollectionDialog(movement: AccountMovement, fullCollection: boolean): void {
    const dialogData: AccountCollectionDialogData = {
      accounts: this.accounts,
      pendingAmount: Number(movement.amount),
      fullCollection,
    };

    this.dialog
      .open<AccountCollectionDialog, AccountCollectionDialogData, AccountCollectionRequest>(
        AccountCollectionDialog,
        {
          data: dialogData,
          width: '500px',
          maxWidth: '95vw',
        },
      )
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((collection) => {
        if (collection) {
          this.registerCollection(movement.id, collection);
        }
      });
  }

  private loadData(): void {
    this.loaderService.show();

    forkJoin({
      accounts: this.accountService.getAccounts(1, 50),
      movements: this.accountMovementService.getAccountMovements(
        this.pageIndex + 1,
        this.pageSize,
        {
          type: ACCOUNT_MOVEMENT_TYPE.INCOME,
          status: ACCOUNT_MOVEMENT_STATUS.RECEIVABLE,
        },
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ accounts, movements }) => {
          this.accounts = accounts.data;

          if (movements.data.length === 0 && this.pageIndex > 0) {
            this.pageIndex--;
            this.loaderService.hide();
            this.loadData();
            return;
          }

          this.setMovements(movements);
          this.loaderService.hide();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar cuentas por cobrar', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private registerCollection(movementId: number, collection: AccountCollectionRequest): void {
    this.loaderService.show();
    this.accountMovementService
      .registerCollection(movementId, collection)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.balanceChanged.emit();
          this.showNotification(
            this.generateNotification('Cobro registrado exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
          this.loadData();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al registrar el cobro', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private setMovements(response: PaginatedResponse<AccountMovement>): void {
    this.dataSource.data = response.data;
    this.totalItems = response.meta.total;
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
