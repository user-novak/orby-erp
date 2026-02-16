import { Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ClientForm } from '../client-form/client-form';
import { ClientService } from '../services/client';
import { ApiResponse } from '../../core/models/global';
import { Client, ClientFormValues } from '../models/client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client-create',
  imports: [MatButtonModule, MatIconModule, ClientForm],
  templateUrl: './client-create.html',
  styleUrl: './client-create.css',
})
export class ClientCreate {
  private readonly clientService: ClientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  createNewClient(clientFormValue: ClientFormValues) {
    this.clientService
      .createClient(clientFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Client>) => {
          console.log(response.message);
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Error al crear cliente', err);
        },
      });
  }

  goClients() {
    this.router.navigate(['/clients']);
  }
}
