import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { MyErrorStateMatcher } from '../core/classess/ErrorStateMatcher';
import { SALES_OPTIONS_TYPES } from './constants/fields';
import { ApiResponse, NotificationData, Option } from '../core/models/global';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillerForm, BillerItem, BillerRequest, BillerResponse } from './models/biller';
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
import { LoaderService } from '../core/services';

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
    MatCheckboxModule,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService: LoaderService = inject(LoaderService);

  constructor() {
    this.generalInfoForm = this.setGeneralInfoForm();
    this.billerForm = this.setBillerForm();
    this.disabledBillerFields();
    this.handleSaleTypeChanges();
    this.handleBillerFormChanges();
    this.loadBillerData();
  }

  get includeIgvControl(): FormControl {
    return this.generalInfoForm.get('include_igv') as FormControl;
  }

  get registerIsDisabled(): boolean {
    return this.totalAmount === 0;
  }

  getStorageStock(): number {
    const storageId = this.billerForm.get('storage_id')?.value;
    if (storageId == null) return 0;

    const storage = this.products.find((p) => p.id === storageId);
    if (storage == null) return 0;

    return storage.stock;
  }

  get productListAmount(): number {
    const total = this.productsList.reduce((acc, item) => acc + item.total_price, 0);
    return Number(total.toFixed(2));
  }

  get getIgv(): number {
    const includeIgv = this.generalInfoForm.get('include_igv')?.value;

    if (!includeIgv) {
      return 0;
    }

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
      sale_date: datageneralInfoForm.sale_date.toISOString().split('T')[0],
      payment_date: datageneralInfoForm.payment_date
        ? datageneralInfoForm.payment_date.toISOString().split('T')[0]
        : null,
      amortization_amount: datageneralInfoForm.amortization_amount,
      sale_type: datageneralInfoForm.sale_type,
      client_id: datageneralInfoForm.client_id,
      account_id: datageneralInfoForm.account_id,
      place: datageneralInfoForm.place,
      items: billerItems,
    };

    this.registerSale(billerRequest);
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
    const amortizationAmountControl = this.generalInfoForm.get('amortization_amount')!;

    saleTypeControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value === 'ACR') {
        paymentDateControl.setValidators([Validators.required]);
      } else {
        paymentDateControl.clearValidators();
        paymentDateControl.setValue(null);
        amortizationAmountControl.setValue(null);
      }

      paymentDateControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private registerSale(billerRequest: BillerRequest) {
    this.billerService
      .registerSale(billerRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<BillerResponse>) => {
          this.showNotification(
            this.generateNotification(response.message, 'check_circle', '#4caf50'),
            3000,
          );
          this.productsList = [];
          this.generalInfoForm.reset();
          this.billerForm.reset();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar los datos', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private loadBillerData() {
    this.loaderService.show();

    this.billerService
      .getBillerData()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.clients = data.clients;
          this.products = data.storages;
          this.accounts = data.accounts;

          this.loaderService.hide();

          this.showNotification(
            this.generateNotification('Datos cargados exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
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
      sale_date: [new Date(), [Validators.required]],
      client_id: [null, [Validators.required]],
      sale_type: [null, [Validators.required]],
      account_id: [null, [Validators.required]],
      place: [null],
      payment_date: [null],
      amortization_amount: [null],
      include_igv: [false],
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
