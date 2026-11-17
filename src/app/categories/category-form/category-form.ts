import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FORM_MODE } from '../../core/enums/global';
import {
  CATEGORY_STATUS,
  CATEGORY_STATUS_OPTIONS,
  CATEGORY_TYPE,
  CATEGORY_TYPE_OPTIONS,
} from '../constants/category';
import { Category, CategoryFormValues } from '../models/category';

interface CategoryFormControls {
  name: FormControl<string>;
  type: FormControl<CATEGORY_TYPE>;
  status: FormControl<CATEGORY_STATUS>;
}

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  readonly category = input<Category | null>(null);
  readonly formMode = input<FORM_MODE>('create');
  readonly categoryTypeOptions = CATEGORY_TYPE_OPTIONS;
  readonly categoryStatusOptions = CATEGORY_STATUS_OPTIONS;

  @Output() formSubmit = new EventEmitter<CategoryFormValues>();

  readonly categoryForm = new FormGroup<CategoryFormControls>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl(CATEGORY_TYPE.INCOME, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl(CATEGORY_STATUS.ACTIVE, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const categoryValue = this.category();
      if (categoryValue) {
        this.categoryForm.patchValue(categoryValue);
      }
    });
  }

  onSubmitForm(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.categoryForm.getRawValue());
  }

  onClearForm(): void {
    this.categoryForm.reset({
      name: '',
      type: CATEGORY_TYPE.INCOME,
      status: CATEGORY_STATUS.ACTIVE,
    });
  }
}
