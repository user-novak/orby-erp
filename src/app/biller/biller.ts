import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../core/classess/ErrorStateMatcher';
import { SALES_TYPES } from './constants/fields';
import { Option } from '../core/models/global';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillerForm } from './models/biller';
import { MatButtonModule } from '@angular/material/button';
import { ModuleHeader } from '../core/components/module-header/module-header';
import { MESAURE_UNITS } from '../core/constants/global';

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
  saleTypes: Option[] = SALES_TYPES;
  clients: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
  clientTypes: string[] = ['Tipo 1', 'Tipo 2'];
  products: string[] = ['Producto 1', 'Producto 2', 'Producto 3'];
  accounts: string[] = ['Entidad 1', 'Entidad 2'];
  mesaureUnities: string[] = MESAURE_UNITS;

  generalInfoForm: FormGroup;
  billerForm: FormGroup;

  productsList: BillerForm[] = [];

  matcher = new MyErrorStateMatcher();

  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.generalInfoForm = this.setGeneralInfoForm();
    this.billerForm = this.setBillerForm();
    this.disabledBillerFields();
    this.handleSaleTypeChanges();
    this.handleBillerFormChanges();
  }

  get productListAmount(): number {
    const total = this.productsList.reduce((acc, item) => acc + item.totalPrice, 0);
    return Number(total.toFixed(2));
  }

  get taxAmount(): number {
    return Number((this.productListAmount * 0.18).toFixed(2));
  }

  get totalAmount(): number {
    return Number((this.productListAmount + this.taxAmount).toFixed(2));
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
    const saleTypeControl = this.generalInfoForm.get('saleType')!;
    const paymentDateControl = this.generalInfoForm.get('paymentDate')!;

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

  private handleBillerFormChanges() {
    const productCtrl = this.billerForm.get('productDescription')!;
    const qtyCtrl = this.billerForm.get('quantity')!;
    const unitPriceCtrl = this.billerForm.get('unitPrice')!;
    const totalPriceCtrl = this.billerForm.get('totalPrice')!;

    productCtrl.valueChanges.pipe(takeUntilDestroyed()).subscribe((product) => {
      if (product == null) {
        unitPriceCtrl.setValue(null, { emitEvent: false });
        totalPriceCtrl.setValue(null, { emitEvent: false });
        return;
      }

      const randomPrice = this.getRandomIntInclusive(1, 100);
      unitPriceCtrl.setValue(randomPrice, { emitEvent: false });

      const qty = Number(qtyCtrl.value) || 0;
      const total = randomPrice * qty;
      totalPriceCtrl.setValue(total, { emitEvent: false });
    });

    qtyCtrl.valueChanges.pipe(takeUntilDestroyed()).subscribe((qtyRaw) => {
      const qty = Number(qtyRaw) || 0;
      const unit = Number(unitPriceCtrl.value) || 0;
      const total = unit * qty;
      totalPriceCtrl.setValue(total, { emitEvent: false });
    });
  }

  private disabledBillerFields() {
    this.billerForm.get('unitPrice')?.disable();
    this.billerForm.get('totalPrice')?.disable();
  }

  private setGeneralInfoForm() {
    return this._fb.group({
      registerDate: [null, [Validators.required]],
      clientType: [null, [Validators.required]],
      client: [null, [Validators.required]],
      saleType: [null, [Validators.required]],
      account: [null, [Validators.required]],
      place: [null],
      paymentDate: [null],
    });
  }

  private setBillerForm() {
    return this._fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      measureUnity: [null, [Validators.required]],
      productDescription: [null, [Validators.required]],
      unitPrice: [null, [Validators.required, Validators.min(1)]],
      totalPrice: [null, [Validators.required, Validators.min(1)]],
    });
  }

  private getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
