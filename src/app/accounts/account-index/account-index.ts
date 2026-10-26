import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { accountColumHeader } from '../constants/account';
import { Account, AccountExcel } from '../models/account';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountExcelMapper } from '../mapper/account-excel';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification';
import { NotificationData, PaginatedResponse } from '../../core/models/global';
import { AccountService } from '../services/account';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog';
import { LoaderService } from '../../core/services';
import { NoData } from '../../core/components/no-data/no-data';
import { SOL_PREFIX } from '../../core/constants/global';

@Component({
  selector: 'app-account-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, NoData],
  templateUrl: './account-index.html',
  styleUrl: './account-index.css',
})
export class AccountIndex implements OnInit {
  accountColumHeader = accountColumHeader;
  SOL_PREFIX = SOL_PREFIX;

  dataSource = new MatTableDataSource<Account>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  private readonly accountService: AccountService = inject(AccountService);
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly loaderService: LoaderService = inject(LoaderService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.listAccounts();
  }

  goToCreate() {
    this.router.navigateByUrl('/accounts/create');
  }

  goToEdit(accountID: number) {
    this.router.navigate(['/accounts/edit', accountID]);
  }

  confirmDelete(accountID: number) {
    this.confirmDialogService
      .open({
        message: '¿Deseas eliminar esta cuenta bancaria?',
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result === 'accept') {
          this.deleteAccount(accountID);
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listAccounts();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.excelService
      .importExcel<AccountExcel>(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          const accounts: Account[] = rows.map((rawRow) => {
            const excelRow = AccountExcelMapper.normalizeExcelRow(rawRow);
            return AccountExcelMapper.toAccount(excelRow);
          });

          this.dataSource.data = accounts;
        },
        error: (err) => {
          console.error('Error al importar Excel', err);
        },
      });
  }

  private deleteAccount(accountID: number) {
    this.accountService
      .deleteAccount(accountID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.dataSource.data.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.listAccounts();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al eliminar cuenta', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private listAccounts() {
    this.loaderService.show();
    this.accountService
      .getAccounts(this.pageIndex + 1, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: PaginatedResponse<Account>) => {
          this.dataSource.data = response.data;
          this.totalItems = response.meta.total;

          this.loaderService.hide();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar cuentas', 'error', '#f44336'),
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

  private showNotification(notification: NotificationData, duration?: number) {
    this.notification.show(notification, duration);
  }
}
