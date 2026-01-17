import { Component, AfterViewInit, ViewChild, inject, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StorageExcel, StorageItem } from '../models/storage';
import { Router } from '@angular/router';
import { storageColumHeader } from '../constants/storage';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageExcelMapper } from '../mappers/storage-excel';

@Component({
  selector: 'app-storage-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './storage-index.html',
  styleUrl: './storage-index.css',
})
export class StorageIndex implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);

  storageColumHeader: string[] = storageColumHeader;

  ELEMENT_DATA: StorageItem[] = [];

  dataSource = new MatTableDataSource<StorageItem>(this.ELEMENT_DATA);

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
      .importExcel<StorageExcel>(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          const storageItems: StorageItem[] = rows.map((rawRow) => {
            const excelRow = StorageExcelMapper.normalizeExcelRow(rawRow);
            return StorageExcelMapper.toStorageItem(excelRow);
          });

          this.ELEMENT_DATA = storageItems;
          this.dataSource.data = storageItems;

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err) => {
          console.error('Error al importar Excel', err);
        },
      });
  }

  goToCreate() {
    this.router.navigateByUrl('/storage/create');
  }
}
