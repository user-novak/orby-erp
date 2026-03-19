import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification';
import { AccountService } from '../services/account';
import { FORM_MODE } from '../../core/enums/global';
import { Account, AccountFormValues } from '../models/account';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse, NotificationData } from '../../core/models/global';
import { AccountForm } from '../account-form/account-form';

@Component({
  selector: 'app-account-edit',
  imports: [MatButtonModule, MatIconModule, AccountForm],
  templateUrl: './account-edit.html',
  styleUrl: './account-edit.css',
})
export class AccountEdit implements OnInit {
  readonly formMode: FORM_MODE = 'edit';
  readonly account = signal<Account | null>(null);
  accountId!: number;

  private readonly accountService: AccountService = inject(AccountService);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.validateAccountID();
  }

  goAccounts() {
    this.router.navigate(['/accounts']);
  }

  editAccount(accountFormValue: AccountFormValues) {
    this.accountService
      .updateAccount(this.accountId, accountFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.goAccounts();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al crear cuenta', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private loadAccount() {
    this.accountService
      .getAccount(this.accountId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Account>) => {
          this.account.set(response.data);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar cuenta', 'error', '#f44336'),
            3000,
          );
          this.goAccounts();
        },
      });
  }

  private validateAccountID(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.accountId) {
      this.goAccounts();
      return;
    }

    this.loadAccount();
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

  private showNotification(notification: NotificationData, duration?: number) {
    this.notification.show(notification, duration);
  }
}
