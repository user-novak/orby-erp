import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { accountColumHeader } from '../constants/account';
import { Account, AccountExcel } from '../models/account';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountExcelMapper } from '../mapper/account-excel';

@Component({
  selector: 'app-account-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './account-index.html',
  styleUrl: './account-index.css',
})
export class AccountIndex {
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);

  accountColumHeader = accountColumHeader;

  ELEMENT_DATA: Account[] = [];

  dataSource = new MatTableDataSource<Account>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
}
