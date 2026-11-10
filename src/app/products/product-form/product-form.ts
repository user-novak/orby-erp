import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MESAURE_UNITS, PERCENTAGE_PREFIX, SOL_PREFIX } from '../../core/constants/global';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product, ProductFormValues } from '../models/product';
import { FORM_MODE } from '../../core/enums/global';

interface ProductFormControls {
  description: FormControl<string>;
  brand: FormControl<string>;
  measure_unity: FormControl<string>;
  unit_price: FormControl<number>;
  percentage_distributor: FormControl<number>;
  price_distributor: FormControl<number>;
  percentage_major: FormControl<number>;
  price_major: FormControl<number>;
  percentage_general: FormControl<number>;
  price_general: FormControl<number>;
  stock: FormControl<number>;
}

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  readonly product = input<Product | null>(null);
  readonly formMode = input<FORM_MODE>('create');

  @Output() formSubmit = new EventEmitter<ProductFormValues>();

  mesaureUnities: string[] = MESAURE_UNITS;
  SOL_PREFIX = SOL_PREFIX;
  PERCENTAGE_PREFIX = PERCENTAGE_PREFIX;

  productForm: FormGroup<ProductFormControls>;

  constructor() {
    this.productForm = this.setProductForm();

    merge(
      this.productForm.controls.unit_price.valueChanges,
      this.productForm.controls.percentage_distributor.valueChanges,
      this.productForm.controls.percentage_major.valueChanges,
      this.productForm.controls.percentage_general.valueChanges,
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePrices());

    effect(() => {
      const productValue = this.product();
      if (productValue) {
        this.patchFormValues(productValue);
        this.disableStockField();
      }
    });
  }

  onClearForm(): void {
    this.productForm.reset();
  }

  onSubmitForm(): void {
    if (this.productForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    this.formSubmit.emit(this.getProductFormValues());
  }

  private patchFormValues(product: Product): void {
    this.productForm.patchValue({
      ...product,
      unit_price: Number(product.unit_price),
      percentage_distributor: Number(product.percentage_distributor),
      percentage_major: Number(product.percentage_major),
      percentage_general: Number(product.percentage_general),
      stock: Number(product.stock),
    });
  }

  private disableStockField(): void {
    this.productForm.controls.stock.disable();
  }

  private getProductFormValues(): ProductFormValues {
    const { stock, ...product } = this.productForm.getRawValue();

    return this.formMode() === 'edit' ? product : { ...product, stock };
  }

  private updatePrices(): void {
    const unitPrice = this.productForm.controls.unit_price.value;

    this.productForm.patchValue(
      {
        price_distributor: this.applyMargin(
          unitPrice,
          this.productForm.controls.percentage_distributor.value,
        ),
        price_major: this.applyMargin(
          unitPrice,
          this.productForm.controls.percentage_major.value,
        ),
        price_general: this.applyMargin(
          unitPrice,
          this.productForm.controls.percentage_general.value,
        ),
      },
      { emitEvent: false },
    );
  }

  private applyMargin(unitPrice: number, percentage: number): number {
    const price = unitPrice + (unitPrice * percentage) / 100;

    return Math.round((price + Number.EPSILON) * 100) / 100;
  }

  private setProductForm(): FormGroup<ProductFormControls> {
    return new FormGroup<ProductFormControls>({
      description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      brand: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      measure_unity: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      unit_price: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
      percentage_distributor: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price_distributor: new FormControl({ value: 0, disabled: true }, { nonNullable: true }),
      percentage_major: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price_major: new FormControl({ value: 0, disabled: true }, { nonNullable: true }),
      percentage_general: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price_general: new FormControl({ value: 0, disabled: true }, { nonNullable: true }),
      stock: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
