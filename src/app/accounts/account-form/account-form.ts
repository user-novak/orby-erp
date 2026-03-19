import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Account, AccountFormValues } from '../models/account';
import { FORM_MODE } from '../../core/enums/global';

@Component({
  selector: 'app-account-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css',
})
export class AccountForm {
  readonly account = input<Account | null>(null);
  readonly formMode = input<FORM_MODE>('create');

  @Output() formSubmit = new EventEmitter<AccountFormValues>();

  accountForm: FormGroup;

  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.accountForm = this.setAccountForm();

    effect(() => {
      const accountValue = this.account();
      if (accountValue) {
        this.patchFormValues(accountValue);
        this.disableAmountField();
      }
    });
  }

  onSubmitForm(): void {
    if (this.accountForm.invalid) {
      console.error('Formulario inválido');
      return;
    }
    this.formSubmit.emit(this.getAccountFormValues());
  }

  onClearForm(): void {
    this.resetForm();
  }

  private patchFormValues(account: Account): void {
    this.accountForm.patchValue(account);
  }

  private getAccountFormValues(): AccountFormValues {
    return this.accountForm.getRawValue();
  }

  private disableAmountField(): void {
    this.accountForm.get('amount')?.disable();
  }

  private setAccountForm(): FormGroup {
    return this._fb.group({
      name: [''],
      amount: [0],
      description: [''],
      account_number: [''],
    });
  }

  private resetForm(): void {
    this.accountForm.reset();
  }
}
