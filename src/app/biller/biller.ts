import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../core/classess/ErrorStateMatcher';
import { SALES_OPTIONS_TYPES } from './constants/fields';
import { NotificationData, Option } from '../core/models/global';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillerForm, BillerItem, BillerRequest } from './models/biller';
import { MatButtonModule } from '@angular/material/button';
import { ModuleHeader } from '../core/components/module-header/module-header';
import { MESAURE_UNITS } from '../core/constants/global';
import { TYPE_CLIENT, TYPES_CLIENT } from '../core/enums/global';
import { BillerService } from './services/biller';
import { Client } from '../clients/models/client';
import { Account } from '../accounts/models/account';
import { Storage } from '../storage/models/storage';
import { NotificationService } from '../core/services/notification/notification';
import { combineLatest, startWith } from 'rxjs';

@Component({
  selector: 'app-biller',
  providers: [...provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ModuleHeader,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './biller.html',
  styleUrl: './biller.css',
})
export class Biller {
  saleTypes: Option[] = SALES_OPTIONS_TYPES;
  clients: Client[] = [];
  clientTypes: TYPES_CLIENT = ['Distribuidor', 'Mayorista', 'U. final'];
  products: Storage[] = [];
  accounts: Account[] = [];
  mesaureUnities: string[] = MESAURE_UNITS;

  generalInfoForm: FormGroup;
  billerForm: FormGroup;

  productsList: BillerForm[] = [];

  matcher = new MyErrorStateMatcher();

  private readonly _fb = inject(FormBuilder);
  private readonly billerService = inject(BillerService);
  private readonly notification = inject(NotificationService);

  constructor() {
    this.generalInfoForm = this.setGeneralInfoForm();
    this.billerForm = this.setBillerForm();
    this.disabledBillerFields();
    this.handleSaleTypeChanges();
    this.handleBillerFormChanges();
    this.loadBillerData();
  }

  get productListAmount(): number {
    const total = this.productsList.reduce((acc, item) => acc + item.total_price, 0);
    return Number(total.toFixed(2));
  }

  get getIgv(): number {
    return Number((this.productListAmount * 0.18).toFixed(2));
  }

  get totalAmount(): number {
    return Number((this.productListAmount + this.getIgv).toFixed(2));
  }

  prepareRegisterSale(): void {
    if (this.generalInfoForm.invalid) {
      return;
    }

    const datageneralInfoForm = this.generalInfoForm.getRawValue();
    const billerItems = this.setBillerItems();

    const billerRequest: BillerRequest = {
      subtotal: this.productListAmount,
      igv: this.getIgv,
      total: this.totalAmount,
      sale_date: datageneralInfoForm.sale_date,
      sale_type: datageneralInfoForm.sale_type,
      client_id: datageneralInfoForm.client_id,
      account_id: datageneralInfoForm.account_id,
      place: datageneralInfoForm.place,
      items: billerItems,
    };

    console.log('Biller Request', billerRequest);
  }

  addProduct() {
    if (this.billerForm.invalid) {
      this.billerForm.markAllAsTouched();
      return;
    }
    this.productsList.push(this.billerForm.getRawValue());
    this.resetBillerForm();
  }

  removeProduct(index: number) {
    this.productsList.splice(index, 1);
  }

  resetBillerForm() {
    this.billerForm.reset();
  }

  private handleSaleTypeChanges() {
    const saleTypeControl = this.generalInfoForm.get('sale_type')!;
    const paymentDateControl = this.generalInfoForm.get('payment_date')!;

    saleTypeControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value === 'ACR') {
        paymentDateControl.setValidators([Validators.required]);
      } else {
        paymentDateControl.clearValidators();
        paymentDateControl.setValue(null);
      }

      paymentDateControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private loadBillerData() {
    this.billerService
      .getBillerData()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.clients = data.clients;
          this.products = data.storages;
          this.accounts = data.accounts;

          this.showNotification(
            this.generateNotification('Datos cargados exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar los datos', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private setBillerItems(): BillerItem[] {
    return this.productsList.map((product: BillerForm) => {
      return {
        quantity: product.quantity,
        unit_price: product.unit_price,
        storage_id: parseInt(product.storage_id),
      };
    });
  }

  private handleBillerFormChanges() {
    const productControl = this.billerForm.get('storage_id')!;
    const quantityControl = this.billerForm.get('quantity')!;
    const unitPriceControl = this.billerForm.get('unit_price')!;
    const clientTypeControl = this.billerForm.get('client_type')!;
    const totalPriceControl = this.billerForm.get('total_price')!;

    combineLatest([
      productControl.valueChanges.pipe(startWith(productControl.value)),
      quantityControl.valueChanges.pipe(startWith(quantityControl.value)),
      clientTypeControl.valueChanges.pipe(startWith(clientTypeControl.value)),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([productId, qtyRaw, clientType]) => {
        if (!productId) {
          unitPriceControl.setValue(null, { emitEvent: false });
          totalPriceControl.setValue(null, { emitEvent: false });
          return;
        }

        const unitPrice = this.getUnitPriceByClientType(productId, clientType);
        const qty = Number(qtyRaw) || 0;
        const total = unitPrice * qty;

        unitPriceControl.setValue(unitPrice, { emitEvent: false });
        totalPriceControl.setValue(total, { emitEvent: false });
      });
  }

  private getUnitPriceByClientType(productId: number, clientType: string): number {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      return 0;
    }

    switch (clientType) {
      case TYPE_CLIENT.DISTRIBUTOR:
        return product.price_distributor;
      case TYPE_CLIENT.MAJOR:
        return product.price_major;
      case TYPE_CLIENT.GENERAL:
        return product.price_general;
      default:
        return 0;
    }
  }

  private disabledBillerFields() {
    this.billerForm.get('unit_price')?.disable();
    this.billerForm.get('total_price')?.disable();
  }

  private setGeneralInfoForm() {
    return this._fb.group({
      sale_date: [null, [Validators.required]],
      client_id: [null, [Validators.required]],
      sale_type: [null, [Validators.required]],
      account_id: [null, [Validators.required]],
      place: [null],
      payment_date: [null],
    });
  }

  private setBillerForm() {
    return this._fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      measure_unity: [null, [Validators.required]],
      storage_id: [null, [Validators.required]],
      client_type: ['U. final', [Validators.required]],
      unit_price: [null, [Validators.required, Validators.min(1)]],
      total_price: [null, [Validators.required, Validators.min(1)]],
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
