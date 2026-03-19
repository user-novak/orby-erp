import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification';
import { NotificationData } from '../../core/models/global';
import { AccountService } from '../services/account';
import { Account, AccountFormValues } from '../models/account';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccountForm } from '../account-form/account-form';

@Component({
  selector: 'app-account-create',
  imports: [MatButtonModule, MatIconModule, AccountForm],
  templateUrl: './account-create.html',
  styleUrl: './account-create.css',
})
export class AccountCreate {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  goAccounts() {
    this.router.navigate(['/accounts']);
  }

  createNewAccount(accountFormValue: AccountFormValues) {
    this.accountService
      .createAccount(accountFormValue)
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
