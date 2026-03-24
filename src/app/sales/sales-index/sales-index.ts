import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { ApiResponse, NotificationData, Option } from '../../core/models/global';
import { Account } from '../../accounts/models/account';
import { Storage } from '../../storage/models/storage';
import { Client } from '../../clients/models/client';
import { NotificationService } from '../../core/services/notification/notification';
import { SALES_COLUMN_HEADERS } from '../constants/sales';
import { BillerDataSalesItemResponse, BillerDataSalesResponse } from '../../biller/models/biller';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SalesFilters } from '../models/sales';

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
export class SalesIndex implements AfterViewInit, OnInit {
  saleTypes: Option[] = SALES_OPTIONS_TYPES;
  products: Storage[] = [];
  accounts: Account[] = [];
  clients: Client[] = [];

  SALES_COLUMN_HEADERS = SALES_COLUMN_HEADERS;
  ELEMENT_DATA: BillerDataSalesResponse[] = [];

  dataSource = new MatTableDataSource<BillerDataSalesResponse>(this.ELEMENT_DATA);

  filterForm: FormGroup;

  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly billerService = inject(BillerService);
  private readonly _fb = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getSaleTypeLabel(value: string): string {
    return this.saleTypes.find((type) => type.value === value)?.label ?? value;
  }

  constructor() {
    this.filterForm = this.setFilterForm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadBillerData();
    this.listSales();
  }

  cleanFilterForm(): void {
    this.resetFilterForm();
    this.listSales();
  }

  applySearchByFilters(): void {
    const filters: SalesFilters = this.filterForm.getRawValue();
    const normalizedFilters = this.normalizeDateFields(filters);
    console.log(normalizedFilters);
    this.listSales(normalizedFilters);
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
    this.billerService
      .getBillerData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.clients = data.clients;
          this.products = data.storages;
          this.accounts = data.accounts;
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar los datos', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private listSales(filters?: SalesFilters) {
    this.billerService
      .getSales(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<BillerDataSalesResponse[]>) => {
          this.dataSource.data = response.data;

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: () => {
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
      storage_id: [null],
      sale_type: [null],
    });
  }

  private resetFilterForm(): void {
    this.filterForm.reset();
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
