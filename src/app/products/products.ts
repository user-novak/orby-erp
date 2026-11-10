import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ModuleHeader } from '../core/components/module-header/module-header';

@Component({
  selector: 'app-products',
  imports: [RouterOutlet, ModuleHeader],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
