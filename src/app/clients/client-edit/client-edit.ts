import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification';
import { ClientService } from '../services/client';
import { Client } from '../models/client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse, NotificationData } from '../../core/models/global';

@Component({
  selector: 'app-client-edit',
  imports: [],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.css',
})
export class ClientEdit implements OnInit {
  client?: Client;
  clientId!: number;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.validateClientID();

    this.loadClient();
  }

  private loadClient() {
    this.clientService
      .getClient(this.clientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Client>) => {
          this.client = response.data;
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
  }
}
