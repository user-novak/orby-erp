import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, forkJoin, startWith } from 'rxjs';
import { Account } from '../../accounts/models/account';
import { AccountService } from '../../accounts/services/account';
import { CATEGORY_STATUS, CATEGORY_TYPE } from '../../categories/constants/category';
import { Category } from '../../categories/models/category';
import { CategoryService } from '../../categories/services/category';
import { SOL_PREFIX } from '../../core/constants/global';
import { NotificationData, Option } from '../../core/models/global';
import { LoaderService, NotificationService } from '../../core/services';
import {
  ACCOUNT_MOVEMENT_STATUS,
  ACCOUNT_MOVEMENT_TYPE,
  ACCOUNT_MOVEMENT_TYPE_OPTIONS,
  EXPENSE_STATUS_OPTIONS,
  INCOME_STATUS_OPTIONS,
  SETTLED_ACCOUNT_MOVEMENT_STATUSES,
} from '../constants/account-movement';
import { AccountMovementRequest } from '../models/account-movement';
import { AccountMovementService } from '../services/account-movement';

interface CashFlowMovementFormControls {
  type: FormControl<ACCOUNT_MOVEMENT_TYPE | null>;
  account_id: FormControl<number | null>;
  amount: FormControl<number | null>;
  movement_date: FormControl<Date>;
  category_id: FormControl<number | null>;
  status: FormControl<ACCOUNT_MOVEMENT_STATUS | null>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-cash-flow-movement',
  providers: [...provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cash-flow-movement.html',
})
export class CashFlowMovement {
  readonly SOL_PREFIX = SOL_PREFIX;
  readonly movementTypeOptions = ACCOUNT_MOVEMENT_TYPE_OPTIONS;
  readonly movementForm = new FormGroup<CashFlowMovementFormControls>({
    type: new FormControl<ACCOUNT_MOVEMENT_TYPE | null>(null, Validators.required),
    account_id: new FormControl<number | null>(null),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    movement_date: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category_id: new FormControl<number | null>(null, Validators.required),
    status: new FormControl<ACCOUNT_MOVEMENT_STATUS | null>(null, Validators.required),
    description: new FormControl('', { nonNullable: true }),
  });

  accounts: Account[] = [];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  statusOptions: Option[] = [];
  accountIsRequired = false;

  private readonly accountMovementService = inject(AccountMovementService);
  private readonly accountService = inject(AccountService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly notification = inject(NotificationService);

  constructor() {
    this.handleTypeChanges();
    this.handleStatusChanges();
    this.loadDropdownData();
  }

  createMovement(): void {
    if (this.movementForm.invalid) {
      this.movementForm.markAllAsTouched();
      return;
    }

    const formValue = this.movementForm.getRawValue();

    if (
      formValue.type === null ||
      formValue.status === null ||
      formValue.category_id === null ||
      formValue.amount === null
    ) {
      return;
    }

    const movement: AccountMovementRequest = {
      amount: formValue.amount,
      movement_date: formValue.movement_date.toISOString(),
      type: formValue.type,
      status: formValue.status,
      category_id: formValue.category_id,
      description: formValue.description || undefined,
      ...(this.accountIsRequired && formValue.account_id !== null
        ? { account_id: formValue.account_id }
        : {}),
    };

    this.loaderService.show();
    this.accountMovementService
      .createAccountMovement(movement)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Movimiento registrado exitosamente', 'check_circle', '#4caf50'),
            3000,
          );
          this.resetForm();
          this.loadDropdownData();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al registrar movimiento', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  resetForm(): void {
    this.movementForm.reset({
      type: null,
      account_id: null,
      amount: null,
      movement_date: new Date(),
      category_id: null,
      status: null,
      description: '',
    });
  }

  private loadDropdownData(): void {
    this.loaderService.show();

    forkJoin({
      accounts: this.accountService.getAccounts(1, 50),
      categories: this.categoryService.getCategories(1, 50),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ accounts, categories }) => {
          this.accounts = accounts.data;
          this.categories = categories.data.filter(
            (category) => category.status === CATEGORY_STATUS.ACTIVE,
          );
          this.filterCategories(this.movementForm.controls.type.value);
          this.loaderService.hide();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar datos del formulario', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private handleTypeChanges(): void {
    this.movementForm.controls.type.valueChanges
      .pipe(startWith(this.movementForm.controls.type.value), takeUntilDestroyed())
      .subscribe((type) => {
        this.statusOptions = this.getStatusOptions(type);
        this.movementForm.controls.status.reset();
        this.movementForm.controls.account_id.reset();
        this.movementForm.controls.category_id.reset();
        this.filterCategories(type);
      });
  }

  private handleStatusChanges(): void {
    combineLatest([
      this.movementForm.controls.type.valueChanges.pipe(
        startWith(this.movementForm.controls.type.value),
      ),
      this.movementForm.controls.status.valueChanges.pipe(
        startWith(this.movementForm.controls.status.value),
      ),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([, status]) => {
        this.accountIsRequired =
          status !== null && SETTLED_ACCOUNT_MOVEMENT_STATUSES.includes(status);

        if (this.accountIsRequired) {
          this.movementForm.controls.account_id.setValidators(Validators.required);
        } else {
          this.movementForm.controls.account_id.clearValidators();
          this.movementForm.controls.account_id.setValue(null, { emitEvent: false });
        }

        this.movementForm.controls.account_id.updateValueAndValidity({ emitEvent: false });
      });
  }

  private getStatusOptions(type: ACCOUNT_MOVEMENT_TYPE | null): Option[] {
    return type === ACCOUNT_MOVEMENT_TYPE.INCOME
      ? INCOME_STATUS_OPTIONS
      : type === ACCOUNT_MOVEMENT_TYPE.EXPENSE
        ? EXPENSE_STATUS_OPTIONS
        : [];
  }

  private filterCategories(type: ACCOUNT_MOVEMENT_TYPE | null): void {
    if (type === null) {
      this.filteredCategories = [];
      return;
    }

    const categoryType =
      type === ACCOUNT_MOVEMENT_TYPE.INCOME ? CATEGORY_TYPE.INCOME : CATEGORY_TYPE.EXPENSE;

    this.filteredCategories = this.categories.filter(
      (category) => category.type === categoryType || category.type === CATEGORY_TYPE.BOTH,
    );
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

  private showNotification(notification: NotificationData, duration?: number): void {
    this.notification.show(notification, duration);
  }
}
