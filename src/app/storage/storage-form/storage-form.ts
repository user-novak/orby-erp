import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MESAURE_UNITS } from '../../core/constants/global';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductFormValues } from '../models/storage';
import { FORM_MODE } from '../../core/enums/global';

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
  readonly storage = input<Product | null>(null);
  readonly formMode = input<FORM_MODE>('create');

  @Output() formSubmit = new EventEmitter<ProductFormValues>();

  mesaureUnities: string[] = MESAURE_UNITS;

  storageForm: FormGroup;

  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.storageForm = this.setStorageForm();

    effect(() => {
      const storageValue = this.storage();
      if (storageValue) {
        this.patchFormValues(storageValue);
        this.disabledStockFields();
      }
    });
  }

  onClearForm(): void {
    this.storageForm.reset();
  }

  onSubmitForm(): void {
    if (this.storageForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    this.formSubmit.emit(this.getStorageFormValues());
  }

  private patchFormValues(storage: Product): void {
    this.storageForm.patchValue(storage);
  }

  private disabledStockFields(): void {
    this.storageForm.get('stock')?.disable();
  }

  private getStorageFormValues(): ProductFormValues {
    return this.storageForm.value;
  }

  private setStorageForm(): FormGroup {
    return this._fb.group({
      description: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      measure_unity: [null, [Validators.required]],
      unit_price: [null, [Validators.required]],
      percentage_distributor: [null, [Validators.required]],
      percentage_major: [null, [Validators.required]],
      percentage_general: [null, [Validators.required]],
      stock: [null, [Validators.required]],
    });
  }
}
