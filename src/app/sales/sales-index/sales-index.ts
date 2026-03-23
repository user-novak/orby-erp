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
import { NotificationData, Option } from '../../core/models/global';
import { Account } from '../../accounts/models/account';
import { Storage } from '../../storage/models/storage';
import { Client } from '../../clients/models/client';
import { NotificationService } from '../../core/services/notification/notification';

@Component({
  selector: 'app-sales-index',
  providers: [...provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './sales-index.html',
  styleUrl: './sales-index.css',
})
export class SalesIndex implements OnInit {
  saleTypes: Option[] = SALES_OPTIONS_TYPES;
  products: Storage[] = [];
  accounts: Account[] = [];
  clients: Client[] = [];

  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly billerService = inject(BillerService);

  ngOnInit(): void {
    this.loadBillerData();
    this.listSales();
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

  private listSales() {
    this.billerService
      .getSales()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar los datos', 'error', '#f44336'),
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
