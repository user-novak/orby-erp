import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
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
export class Biller implements OnInit {
  saleTypes: Option[] = SALES_TYPES;
  clients: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
  clientTypes: string[] = ['Tipo 1', 'Tipo 2'];
  products: string[] = ['Producto 1', 'Producto 2', 'Producto 3'];
  accounts: string[] = ['Entidad 1', 'Entidad 2'];
  mesaureUnities: string[] = ['kg', 'mg'];

  generalInfoForm: FormGroup;
  billerForm: FormGroup;

  matcher = new MyErrorStateMatcher();

  private readonly destroyRef = inject(DestroyRef);
  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.generalInfoForm = this.setGeneralInfoForm();
    this.billerForm = this.setBillerForm();
  }

  ngOnInit(): void {
    this.handleSaleTypeChanges();
  }

  private handleSaleTypeChanges() {
    const saleTypeControl = this.generalInfoForm.get('saleType')!;
    const paymentDateControl = this.generalInfoForm.get('paymentDate')!;

    saleTypeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value === 'ACR') {
        paymentDateControl.setValidators([Validators.required]);
      } else {
        paymentDateControl.clearValidators();
        paymentDateControl.setValue('');
      }

      paymentDateControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private setGeneralInfoForm() {
    return this._fb.group({
      registerDate: ['', [Validators.required]],
      clientType: ['', [Validators.required]],
      client: ['', [Validators.required]],
      saleType: ['', [Validators.required]],
      account: ['', [Validators.required]],
      place: [''],
      paymentDate: [''],
    });
  }

  private setBillerForm() {
    return this._fb.group({
      quantity: [0, [Validators.required]],
      measureUnity: ['', [Validators.required]],
      productDescription: ['', [Validators.required]],
      unitPrice: [0, [Validators.required]],
      totalPrice: [0, [Validators.required]],
    });
  }
}
