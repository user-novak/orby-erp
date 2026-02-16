import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MESAURE_UNITS } from '../../core/constants/global';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-storage-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './storage-form.html',
  styleUrl: './storage-form.css',
})
export class StorageForm {
  mesaureUnities: string[] = MESAURE_UNITS;
  tempValues: string[] = ['Valor 1', 'Valor 2'];

  storageForm: FormGroup;

  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.storageForm = this.setStorageForm();
    this.disablePriceFields();
    this.handlePriceCalculations();
  }

  onClearForm(): void {
    this.storageForm.reset();
  }

  onSubmitForm(): void {
    if (this.storageForm.invalid) {
      console.error('Formulario inválido');
      return;
    }
    console.log('Formulario válido', this.storageForm.getRawValue());
  }

  private handlePriceCalculations(): void {
    const unitPriceCtrl = this.storageForm.get('unitPrice')!;

    const map = [
      {
        percentage: 'percentage_distributor',
        price: 'price_distributor',
      },
      {
        percentage: 'percentage_major',
        price: 'price_major',
      },
      {
        percentage: 'percentage_general',
        price: 'price_general',
      },
    ];

    unitPriceCtrl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.recalculatePrices(map));

    map.forEach(({ percentage }) => {
      this.storageForm
        .get(percentage)!
        .valueChanges.pipe(takeUntilDestroyed())
        .subscribe(() => this.recalculatePrices(map));
    });
  }

  private recalculatePrices(map: { percentage: string; price: string }[]): void {
    const unitPrice = Number(this.storageForm.get('unitPrice')?.value);

    if (!unitPrice) {
      map.forEach(({ price }) => {
        this.storageForm.get(price)?.setValue(null, { emitEvent: false });
      });
      return;
    }

    map.forEach(({ percentage, price }) => {
      const percentageValue = Number(this.storageForm.get(percentage)?.value);

      if (!percentageValue) {
        this.storageForm.get(price)?.setValue(null, { emitEvent: false });
        return;
      }

      const calculatedPrice = unitPrice + (unitPrice * percentageValue) / 100;

      this.storageForm.get(price)?.setValue(calculatedPrice, { emitEvent: false });
    });
  }

  private disablePriceFields(): void {
    this.storageForm.get('price_distributor')?.disable();
    this.storageForm.get('price_major')?.disable();
    this.storageForm.get('price_general')?.disable();
  }

  private setStorageForm(): FormGroup {
    return this._fb.group({
      description: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      measureUnity: [null, [Validators.required]],
      unitPrice: [null, [Validators.required]],
      percentage_distributor: [null, [Validators.required]],
      price_distributor: [null, [Validators.required]],
      percentage_major: [null, [Validators.required]],
      price_major: [null, [Validators.required]],
      percentage_general: [null, [Validators.required]],
      price_general: [null, [Validators.required]],
      input: [null, [Validators.required]],
      output: [null, [Validators.required]],
      stock: [null, [Validators.required]],
    });
  }
}
