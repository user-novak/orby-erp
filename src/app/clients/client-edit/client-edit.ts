import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../core/services/notification/notification';
import { ClientService } from '../services/client';
import { Client, ClientFormValues } from '../models/client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse, NotificationData } from '../../core/models/global';
import { ClientForm } from '../client-form/client-form';
import { FORM_MODE } from '../../core/enums/global';

@Component({
  selector: 'app-client-edit',
  imports: [MatButtonModule, MatIconModule, ClientForm],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.css',
})
export class ClientEdit implements OnInit {
  readonly formMode: FORM_MODE = 'edit';
  readonly client = signal<Client | null>(null);
  clientId!: number;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.validateClientID();
  }

  goClients() {
    this.router.navigate(['/clients']);
  }

  editClient(clientFormValue: ClientFormValues) {
    this.clientService
      .updateClient(this.clientId, clientFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al actualizar cliente', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private loadClient() {
    this.clientService
      .getClient(this.clientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Client>) => {
          this.client.set(response.data);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar cliente', 'error', '#f44336'),
            3000,
          );
          this.router.navigate(['/clients']);
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

  private validateClientID(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.clientId) {
      this.router.navigate(['/clients']);
      return;
    }

    this.loadClient();
  }
}
