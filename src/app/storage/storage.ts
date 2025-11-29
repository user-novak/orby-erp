import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-storage',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './storage.html',
  styleUrl: './storage.css',
})
export class Storage {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
