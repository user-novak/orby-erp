import { Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ClientForm } from '../client-form/client-form';
import { ClientService } from '../services/client';
import { NotificationData } from '../../core/models/global';
import { ClientFormValues } from '../models/client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../core/services/notification/notification';

@Component({
  selector: 'app-client-create',
  imports: [MatButtonModule, MatIconModule, ClientForm],
  templateUrl: './client-create.html',
  styleUrl: './client-create.css',
})
export class ClientCreate {
  private readonly clientService: ClientService = inject(ClientService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  createNewClient(clientFormValue: ClientFormValues) {
    this.clientService
      .createClient(clientFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al crear cliente', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  goClients() {
    this.router.navigate(['/clients']);
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
