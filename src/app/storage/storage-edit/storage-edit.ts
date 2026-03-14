import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse, NotificationData } from '../../core/models/global';
import { FORM_MODE } from '../../core/enums/global';
import { Storage, StorageFormValues } from '../models/storage';
import { NotificationService } from '../../core/services/notification/notification';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StorageForm } from '../storage-form/storage-form';

@Component({
  selector: 'app-storage-edit',
  imports: [MatButtonModule, MatIconModule, StorageForm],
  templateUrl: './storage-edit.html',
  styleUrl: './storage-edit.css',
})
export class StorageEdit implements OnInit {
  readonly formMode: FORM_MODE = 'edit';
  readonly storage = signal<Storage | null>(null);
  storageId!: number;

  private readonly storageService = inject(StorageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    this.validateStorageID();
  }

  goStorages() {
    this.router.navigate(['/storage']);
  }

  editStorage(storageFormValue: StorageFormValues) {
    this.storageService
      .updateStorage(this.storageId, storageFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.goStorages();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al actualizar producto', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private validateStorageID(): void {
    this.storageId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.storageId) {
      this.goStorages();
      return;
    }

    this.loadStorage();
  }

  private loadStorage(): void {
    this.storageService
      .getStorage(this.storageId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Storage>) => {
          this.storage.set(response.data);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar producto', 'error', '#f44336'),
            3000,
          );
          this.goStorages();
        },
      });
  }

  private generateNotification(
    message: string,
    icon: string,
    backgroundColor: string,
  ): NotificationData {
    return { message, icon, backgroundColor };
  }

  private showNotification(notification: NotificationData, duration?: number) {
    this.notification.show(notification, duration);
  }
}
