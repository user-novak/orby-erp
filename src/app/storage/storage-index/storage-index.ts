import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductExcel, Product } from '../models/storage';
import { Router } from '@angular/router';
import { storageColumHeader } from '../constants/storage';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageExcelMapper } from '../mappers/storage-excel';
import { StorageService } from '../services/storage';
import { NotificationService } from '../../core/services/notification/notification';
import { NotificationData, PaginatedResponse } from '../../core/models/global';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog';
import { LoaderService } from '../../core/services';
import { NoData } from '../../core/components/no-data/no-data';

@Component({
  selector: 'app-storage-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, NoData],
  templateUrl: './storage-index.html',
  styleUrl: './storage-index.css',
})
export class StorageIndex implements OnInit {
  storageColumHeader: string[] = storageColumHeader;

  dataSource = new MatTableDataSource<Product>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  private readonly storageService = inject(StorageService);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly router = inject(Router);
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService: LoaderService = inject(LoaderService);

  ngOnInit() {
    this.listProducts();
  }

  goToEdit(storageID: number) {
    this.router.navigate(['/storage/edit', storageID]);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listProducts();
  }

  confirmDelete(storageID: number) {
    this.confirmDialogService
      .open({
        message: '¿Deseas eliminar este producto?',
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result === 'accept') {
          this.deleteStorage(storageID);
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
      .importExcel<ProductExcel>(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          const storageItems: Product[] = rows.map((rawRow) => {
            const excelRow = StorageExcelMapper.normalizeExcelRow(rawRow);
            return StorageExcelMapper.toStorageItem(excelRow);
          });

          this.dataSource.data = storageItems;
        },
        error: (err) => {
          console.error('Error al importar Excel', err);
        },
      });
  }

  goToCreate() {
    this.router.navigateByUrl('/storage/create');
  }

  private deleteStorage(storageID: number) {
    this.storageService.deleteStorage(storageID).subscribe({
      next: () => {
        this.listProducts();
      },
      error: () => {
        this.showNotification(
          this.generateNotification('Error al eliminar producto', 'error', '#f44336'),
          3000,
        );
      },
    });
  }

  private listProducts() {
    this.loaderService.show();
    this.storageService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: PaginatedResponse<Product>) => {
          this.dataSource.data = response.data;
          this.totalItems = response.meta.total;

          this.loaderService.hide();

          this.showNotification(
            this.generateNotification('Productos cargados exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar productos', 'error', '#f44336'),
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
