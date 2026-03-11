import { Component, DestroyRef, inject } from '@angular/core';
import { StorageForm } from '../storage-form/storage-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification';
import { StorageService } from '../services/storage';
import { NotificationData } from '../../core/models/global';
import { StorageFormValues } from '../models/storage';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-storage-create',
  imports: [StorageForm, MatButtonModule, MatIconModule],
  templateUrl: './storage-create.html',
  styleUrl: './storage-create.css',
})
export class StorageCreate {
  private readonly storageService = inject(StorageService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  createNewStorage(storageFormValue: StorageFormValues) {
    this.storageService
      .createStorage(storageFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.goStorage();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al crear cliente', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  goStorage() {
    this.router.navigate(['/storage']);
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
