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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MyErrorStateMatcher } from '../core/classess/ErrorStateMatcher';
import {
  DEFAULT_IGV_PERCENTAGE,
  PRICE_TIER,
  PRICE_TIER_OPTIONS,
  SALE_TYPE,
  SALES_OPTIONS_TYPES,
} from './constants/fields';
import { NotificationData, Option } from '../core/models/global';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillerForm, BillerItem, BillerRequest } from './models/biller';
import { MatButtonModule } from '@angular/material/button';
import { ModuleHeader } from '../core/components/module-header/module-header';
import { MESAURE_UNITS } from '../core/constants/global';
import { BillerService } from './services/biller';
import { Client } from '../clients/models/client';
import { Account } from '../accounts/models/account';
import { Product } from '../products/models/product';
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
  readonly saleType = SALE_TYPE;
  saleTypes: Option[] = SALES_OPTIONS_TYPES;
  clients: Client[] = [];
  priceTiers: Option[] = PRICE_TIER_OPTIONS;
  products: Product[] = [];
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
    this.handleIgvChanges();
    this.handleBillerFormChanges();
    this.loadBillerData();
  }

  get registerIsDisabled(): boolean {
    return this.totalAmount === 0;
  }

  get includeIgvControl(): FormControl {
    return this.generalInfoForm.get('include_igv') as FormControl;
  }

  get igvPercentageControl(): FormControl {
    return this.generalInfoForm.get('igv_percentage') as FormControl;
  }

  getProductStock(): number {
    const productId = this.billerForm.get('product_id')?.value;
    if (productId == null) return 0;

    const product = this.products.find((item) => item.id === productId);
    if (product == null) return 0;

    return product.stock;
  }

  get productListAmount(): number {
    const total = this.productsList.reduce((acc, item) => acc + item.total_price, 0);
    return this.roundAmount(total);
  }

  get getIgv(): number {
    if (!this.includeIgvControl.value) {
      return 0;
    }

    return this.roundAmount(
      (this.productListAmount * Number(this.igvPercentageControl.value)) / 100,
    );
  }

  get totalAmount(): number {
    return this.roundAmount(this.productListAmount + this.getIgv);
  }

  prepareRegisterSale(): void {
    if (this.generalInfoForm.invalid) {
      return;
    }

    const datageneralInfoForm = this.generalInfoForm.getRawValue();
    const billerItems = this.setBillerItems();
    const igvData = datageneralInfoForm.include_igv
      ? {
          igv: this.getIgv,
          igv_percentage: Number(datageneralInfoForm.igv_percentage),
        }
      : {};

    const billerRequest: BillerRequest = {
      subtotal: this.productListAmount,
      ...igvData,
      total: this.totalAmount,
      sale_date: datageneralInfoForm.sale_date.toISOString().split('T')[0],
      payment_date: datageneralInfoForm.payment_date
        ? datageneralInfoForm.payment_date.toISOString().split('T')[0]
        : null,
      initial_payment: datageneralInfoForm.initial_payment || undefined,
      sale_type: datageneralInfoForm.sale_type,
      client_id: datageneralInfoForm.client_id,
      account_id: datageneralInfoForm.account_id,
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
    this.billerForm.reset({ price_tier: PRICE_TIER.GENERAL });
  }

  private handleSaleTypeChanges() {
    const saleTypeControl = this.generalInfoForm.get('sale_type')!;
    const paymentDateControl = this.generalInfoForm.get('payment_date')!;
    const initialPaymentControl = this.generalInfoForm.get('initial_payment')!;
    const accountControl = this.generalInfoForm.get('account_id')!;

    combineLatest([
      saleTypeControl.valueChanges.pipe(startWith(saleTypeControl.value)),
      initialPaymentControl.valueChanges.pipe(startWith(initialPaymentControl.value)),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([saleType, initialPayment]) => {
        if (saleType === SALE_TYPE.CASH) {
          paymentDateControl.setValue(null, { emitEvent: false });
          initialPaymentControl.setValue(null, { emitEvent: false });
        }

        const accountIsRequired =
          saleType === SALE_TYPE.CASH ||
          (saleType === SALE_TYPE.CREDIT && Number(initialPayment) > 0);

        accountIsRequired
          ? accountControl.setValidators([Validators.required])
          : accountControl.clearValidators();

        accountControl.updateValueAndValidity({ emitEvent: false });
      });
  }

  private registerSale(billerRequest: BillerRequest) {
    this.billerService
      .registerSale(billerRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showNotification(
            this.generateNotification('Venta registrada exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
          this.productsList = [];
          this.generalInfoForm.reset({
            sale_date: new Date(),
            include_igv: false,
            igv_percentage: DEFAULT_IGV_PERCENTAGE,
          });
          this.resetBillerForm();
          this.loadBillerData(false);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al registrar la venta', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private handleIgvChanges(): void {
    this.includeIgvControl.valueChanges
      .pipe(startWith(this.includeIgvControl.value), takeUntilDestroyed())
      .subscribe((includeIgv) => {
        includeIgv
          ? this.igvPercentageControl.enable({ emitEvent: false })
          : this.igvPercentageControl.disable({ emitEvent: false });
      });
  }

  private loadBillerData(showSuccessNotification = true) {
    this.loaderService.show();

    this.billerService
      .getBillerData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.clients = data.clients;
          this.products = data.products;
          this.accounts = data.accounts;

          this.loaderService.hide();

          if (showSuccessNotification) {
            this.showNotification(
              this.generateNotification('Datos cargados exitosamente', 'check_circle', '#4caf50'),
              3000,
            );
          }
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
        product_id: product.product_id,
        price_tier: product.price_tier,
        unit_price: Number(product.unit_price),
      };
    });
  }

  private handleBillerFormChanges() {
    const productControl = this.billerForm.get('product_id')!;
    const quantityControl = this.billerForm.get('quantity')!;
    const unitPriceControl = this.billerForm.get('unit_price')!;
    const priceTierControl = this.billerForm.get('price_tier')!;
    const totalPriceControl = this.billerForm.get('total_price')!;

    combineLatest([
      productControl.valueChanges.pipe(startWith(productControl.value)),
      quantityControl.valueChanges.pipe(startWith(quantityControl.value)),
      priceTierControl.valueChanges.pipe(startWith(priceTierControl.value)),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([productId, qtyRaw, priceTier]) => {
        if (!productId) {
          unitPriceControl.setValue(null, { emitEvent: false });
          totalPriceControl.setValue(null, { emitEvent: false });
          return;
        }

        const unitPrice = Number(this.getUnitPriceByPriceTier(productId, priceTier));
        const qty = Number(qtyRaw) || 0;
        const total = this.roundAmount(unitPrice * qty);

        unitPriceControl.setValue(unitPrice, { emitEvent: false });
        totalPriceControl.setValue(total, { emitEvent: false });
      });
  }

  private getUnitPriceByPriceTier(productId: number, priceTier: PRICE_TIER): number {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      return 0;
    }

    switch (priceTier) {
      case PRICE_TIER.DISTRIBUTOR:
        return product.price_distributor;
      case PRICE_TIER.MAJOR:
        return product.price_major;
      case PRICE_TIER.GENERAL:
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
      account_id: [null],
      payment_date: [null],
      initial_payment: [null, [Validators.min(0.01)]],
      include_igv: [false],
      igv_percentage: [
        { value: DEFAULT_IGV_PERCENTAGE, disabled: true },
        [Validators.required, Validators.min(0.01), Validators.max(100)],
      ],
    });
  }

  private setBillerForm() {
    return this._fb.group({
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      measure_unity: [null, [Validators.required]],
      product_id: [null, [Validators.required]],
      price_tier: [PRICE_TIER.GENERAL, [Validators.required]],
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

  private roundAmount(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
