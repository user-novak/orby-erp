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

@Component({
  selector: 'app-biller',
  providers: [...provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
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
  mesaureUnities: string[] = ['kg', 'mg'];

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
  }

  addProduct() {
    if (this.billerForm.invalid) {
      this.billerForm.markAllAsTouched();
      return;
    }
    this.productsList.push(this.billerForm.value);
    this.resetBillerForm();
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

  private disabledBillerFields(){
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
}
