import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ModuleHeader } from '../core/components/module-header/module-header';

@Component({
  selector: 'app-storage',
  imports: [RouterOutlet, ModuleHeader],
  templateUrl: './storage.html',
  styleUrl: './storage.css',
})
export class Storage {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
