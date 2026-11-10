import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductExcel, Product } from '../models/product';
import { Router } from '@angular/router';
import { productColumnHeaders } from '../constants/product';
import { ExcelImportService } from '../../core/services/excel/excel-import';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductExcelMapper } from '../mappers/product-excel';
import { ProductService } from '../services/product';
import { NotificationService } from '../../core/services/notification/notification';
import { NotificationData, PaginatedResponse } from '../../core/models/global';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog';
import { LoaderService } from '../../core/services';
import { NoData } from '../../core/components/no-data/no-data';
import { SOL_PREFIX } from '../../core/constants/global';

@Component({
  selector: 'app-product-index',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, NoData],
  templateUrl: './product-index.html',
  styleUrl: './product-index.css',
})
export class ProductIndex implements OnInit {
  productColumnHeaders: string[] = productColumnHeaders;
  SOL_PREFIX = SOL_PREFIX;

  dataSource = new MatTableDataSource<Product>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly router = inject(Router);
  private readonly excelService: ExcelImportService = inject(ExcelImportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService: LoaderService = inject(LoaderService);

  ngOnInit() {
    this.listProducts();
  }

  goToEdit(productId: number) {
    this.router.navigate(['/products/edit', productId]);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listProducts();
  }

  confirmDelete(productId: number) {
    this.confirmDialogService
      .open({
        message: '¿Deseas eliminar este producto?',
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result === 'accept') {
          this.deleteProduct(productId);
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
          const products: Product[] = rows.map((rawRow) => {
            const excelRow = ProductExcelMapper.normalizeExcelRow(rawRow);
            return ProductExcelMapper.toProduct(excelRow);
          });

          this.dataSource.data = products;
        },
        error: (err) => {
          console.error('Error al importar Excel', err);
        },
      });
  }

  goToCreate() {
    this.router.navigateByUrl('/products/create');
  }

  private deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
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
    this.productService
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
