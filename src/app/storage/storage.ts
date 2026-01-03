import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-storage',
  imports: [MatIconModule, RouterOutlet],
  templateUrl: './storage.html',
  styleUrl: './storage.css',
})
export class Storage {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
