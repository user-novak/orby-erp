import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BillerService } from '../../biller/services/biller';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SALES_OPTIONS_TYPES } from '../../biller/constants/fields';
import {
  DetailDialogData,
  NotificationData,
  Option,
  PaginatedResponse,
} from '../../core/models/global';
import { Account } from '../../accounts/models/account';
import { Product } from '../../products/models/product';
import { Client } from '../../clients/models/client';
import { NotificationService } from '../../core/services/notification/notification';
import { SALES_COLUMN_HEADERS } from '../constants/sales';
import { BillerDataSalesResponse, BillerResponse } from '../../biller/models/biller';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SalesFilters } from '../models/sales';
import { DetailDialogService, LoaderService } from '../../core/services';

@Component({
  selector: 'app-sales-index',
  providers: [...provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './sales-index.html',
  styleUrl: './sales-index.css',
})
export class SalesIndex implements OnInit {
  saleTypes: Option[] = SALES_OPTIONS_TYPES;
  products: Product[] = [];
  accounts: Account[] = [];
  clients: Client[] = [];

  SALES_COLUMN_HEADERS = SALES_COLUMN_HEADERS;
  dataSource = new MatTableDataSource<BillerDataSalesResponse>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  filterForm: FormGroup;

  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly billerService = inject(BillerService);
  private readonly _fb = inject(FormBuilder);
  private readonly loaderService: LoaderService = inject(LoaderService);
  private readonly detailDialogService = inject(DetailDialogService);
  private currentFilters: SalesFilters = {};

  getAccountName(accountId: number): string {
    const account = this.accounts.find((acc) => acc.id === accountId);
    return account ? account.name : '';
  }

  getSaleTypeLabel(value: string): string {
    return this.saleTypes.find((type) => type.value === value)?.label ?? value;
  }

  constructor() {
    this.filterForm = this.setFilterForm();
  }

  ngOnInit(): void {
    this.loadBillerData();
  }

  cleanFilterForm(): void {
    this.resetFilterForm();
    this.currentFilters = {};
    this.pageIndex = 0;
    this.listSales();
  }

  applySearchByFilters(): void {
    const filters: SalesFilters = this.filterForm.getRawValue();
    this.currentFilters = this.normalizeDateFields(filters);
    this.pageIndex = 0;
    this.listSales();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listSales();
  }

  openSaleDetail(saleId: number): void {
    this.loaderService.show();
    this.billerService
      .getSale(saleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.detailDialogService.open(this.buildSaleDetail(response.data));
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar el detalle de la venta', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private normalizeDateFields(filters: SalesFilters): SalesFilters {
    const normalizedFilters = { ...filters };

    if (filters.date_from) {
      const date = new Date(filters.date_from);
      normalizedFilters.date_from = date.toISOString().split('T')[0];
    }

    if (filters.date_to) {
      const date = new Date(filters.date_to);
      normalizedFilters.date_to = date.toISOString().split('T')[0];
    }

    return normalizedFilters;
  }

  private loadBillerData() {
    this.loaderService.show();

    this.billerService
      .getBillerData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.clients = data.clients;
          this.products = data.products;
          this.accounts = data.accounts;

          this.listSales();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar los datos', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private listSales() {
    this.loaderService.show();
    this.billerService
      .getSales(this.pageIndex + 1, this.pageSize, this.currentFilters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: PaginatedResponse<BillerDataSalesResponse>) => {
          this.dataSource.data = response.data;
          this.totalItems = response.meta.total;
          this.loaderService.hide();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar los datos', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private setFilterForm(): FormGroup {
    return this._fb.group({
      date_from: [null],
      date_to: [null],
      client_id: [null],
      account_id: [null],
      product_id: [null],
      sale_type: [null],
    });
  }

  private resetFilterForm(): void {
    this.filterForm.reset();
  }

  private buildSaleDetail(sale: BillerResponse): DetailDialogData {
    return {
      title: `Detalle de venta #${sale.id}`,
      sections: [
        {
          title: 'Información general',
          fields: [
            { label: 'Fecha de venta', value: this.formatDate(sale.sale_date) },
            { label: 'Tipo de venta', value: this.getSaleTypeLabel(sale.sale_type) },
            { label: 'Cliente', value: sale.client.name },
            { label: 'DNI', value: sale.client.dni },
            { label: 'RUC', value: sale.client.ruc },
            { label: 'Teléfono', value: sale.client.phone },
            { label: 'Cuenta bancaria', value: sale.account?.name ?? 'Sin cuenta' },
            { label: 'Fecha de pago', value: this.formatDate(sale.payment_date) },
            { label: 'Fecha de registro', value: this.formatDate(sale.created_at) },
          ],
        },
        {
          title: 'Importes',
          fields: [
            { label: 'Subtotal', value: this.formatCurrency(sale.subtotal) },
            {
              label: 'Porcentaje IGV',
              value: sale.igv_percentage === null ? 'Exonerada' : `${sale.igv_percentage}%`,
            },
            { label: 'IGV', value: this.formatCurrency(sale.igv) },
            { label: 'Total', value: this.formatCurrency(sale.total) },
          ],
        },
      ],
      tables: [
        {
          title: 'Productos',
          columns: [
            { key: 'product', label: 'Producto' },
            { key: 'brand', label: 'Marca' },
            { key: 'measureUnity', label: 'U.M.' },
            { key: 'quantity', label: 'Cantidad' },
            { key: 'unitPrice', label: 'Precio unitario' },
            { key: 'subtotal', label: 'Subtotal' },
          ],
          rows: sale.items.map((item) => ({
            product: item.product.description,
            brand: item.product.brand,
            measureUnity: item.product.measure_unity,
            quantity: item.quantity,
            unitPrice: this.formatCurrency(item.unit_price),
            subtotal: this.formatCurrency(item.subtotal),
          })),
        },
        {
          title: 'Movimientos de cuenta',
          columns: [
            { key: 'date', label: 'Fecha' },
            { key: 'account', label: 'Cuenta' },
            { key: 'type', label: 'Tipo' },
            { key: 'status', label: 'Estado' },
            { key: 'description', label: 'Descripción' },
            { key: 'amount', label: 'Monto' },
          ],
          rows: sale.account_movements.map((movement) => ({
            date: this.formatDate(movement.movement_date),
            account: movement.account?.name ?? 'Sin cuenta',
            type: movement.type,
            status: movement.status,
            description: movement.description,
            amount: this.formatCurrency(movement.amount),
          })),
        },
      ],
    };
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(Number(value));
  }

  private formatDate(value: string | null): string {
    if (!value) {
      return '-';
    }

    const [year, month, day] = value.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
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
