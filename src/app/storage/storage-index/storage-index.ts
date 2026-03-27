import { Component, AfterViewInit, ViewChild, inject, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StorageExcel, Storage } from '../models/storage';
import { Router } from '@angular/router';
import { storageColumHeader } from '../constants/storage';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageExcelMapper } from '../mappers/storage-excel';
import { StorageService } from '../services/storage';
import { NotificationService } from '../../core/services/notification/notification';
import { ApiResponse, NotificationData } from '../../core/models/global';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog';
import { LoaderService } from '../../core/services';

@Component({
  selector: 'app-storage-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './storage-index.html',
  styleUrl: './storage-index.css',
})
export class StorageIndex implements AfterViewInit, OnInit {
  private readonly storageService = inject(StorageService);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly router = inject(Router);
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService: LoaderService = inject(LoaderService);

  storageColumHeader: string[] = storageColumHeader;

  ELEMENT_DATA: Storage[] = [];

  dataSource = new MatTableDataSource<Storage>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.listStorages();
  }

  goToEdit(storageID: number) {
    this.router.navigate(['/storage/edit', storageID]);
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
      .importExcel<StorageExcel>(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          const storageItems: Storage[] = rows.map((rawRow) => {
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

  private deleteStorage(storageID: number) {
    this.storageService.deleteStorage(storageID).subscribe({
      next: () => {
        this.listStorages();
      },
      error: () => {
        this.showNotification(
          this.generateNotification('Error al eliminar producto', 'error', '#f44336'),
          3000,
        );
      },
    });
  }

  private listStorages() {
    this.loaderService.show();
    this.storageService
      .getStorages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Storage[]>) => {
          this.dataSource.data = response.data;

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

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
