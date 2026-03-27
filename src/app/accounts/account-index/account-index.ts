import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { accountColumHeader } from '../constants/account';
import { Account, AccountExcel } from '../models/account';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountExcelMapper } from '../mapper/account-excel';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification';
import { ApiResponse, NotificationData } from '../../core/models/global';
import { AccountService } from '../services/account';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog';
import { LoaderService } from '../../core/services';

@Component({
  selector: 'app-account-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './account-index.html',
  styleUrl: './account-index.css',
})
export class AccountIndex implements AfterViewInit, OnInit {
  accountColumHeader = accountColumHeader;

  ELEMENT_DATA: Account[] = [];

  dataSource = new MatTableDataSource<Account>(this.ELEMENT_DATA);

  private readonly accountService: AccountService = inject(AccountService);
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly loaderService: LoaderService = inject(LoaderService);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

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

          this.ELEMENT_DATA = accounts;
          this.dataSource.data = accounts;

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
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
      .getAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Account[]>) => {
          this.dataSource.data = response.data;

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          this.loaderService.hide();

          this.showNotification(
            this.generateNotification('Cuentas cargadas exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
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
