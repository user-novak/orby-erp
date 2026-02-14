import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-create',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './client-create.html',
  styleUrl: './client-create.css',
})
export class ClientCreate {
  private readonly router = inject(Router);

  goClients() {
    this.router.navigate(['/clients']);
  }
}
