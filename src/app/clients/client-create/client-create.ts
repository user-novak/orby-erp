import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ClientForm } from "../client-form/client-form";

@Component({
  selector: 'app-client-create',
  imports: [MatButtonModule, MatIconModule, ClientForm],
  templateUrl: './client-create.html',
  styleUrl: './client-create.css',
})
export class ClientCreate {
  private readonly router = inject(Router);

  goClients() {
    this.router.navigate(['/clients']);
  }
}
