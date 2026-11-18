import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Account } from '../../../accounts/models/account';
import { SOL_PREFIX } from '../../../core/constants/global';
import { AccountCollectionRequest } from '../../models/account-movement';

export interface AccountCollectionDialogData {
  accounts: Account[];
  pendingAmount: number;
  fullCollection: boolean;
}

interface AccountCollectionFormControls {
  account_id: FormControl<number | null>;
  amount: FormControl<number | null>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-account-collection-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './account-collection-dialog.html',
})
export class AccountCollectionDialog {
  readonly SOL_PREFIX = SOL_PREFIX;
  readonly data = inject<AccountCollectionDialogData>(MAT_DIALOG_DATA);
  readonly collectionForm = new FormGroup<AccountCollectionFormControls>({
    account_id: new FormControl<number | null>(null, Validators.required),
    amount: new FormControl<number | null>(
      this.data.fullCollection ? this.data.pendingAmount : null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.data.pendingAmount),
      ],
    ),
    description: new FormControl('', { nonNullable: true }),
  });

  private readonly dialogRef = inject(
    MatDialogRef<AccountCollectionDialog, AccountCollectionRequest | undefined>,
  );

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.collectionForm.invalid) {
      this.collectionForm.markAllAsTouched();
      return;
    }

    const formValue = this.collectionForm.getRawValue();

    if (formValue.account_id === null || formValue.amount === null) {
      return;
    }

    this.dialogRef.close({
      account_id: formValue.account_id,
      amount: formValue.amount,
      description: formValue.description || undefined,
    });
  }
}
