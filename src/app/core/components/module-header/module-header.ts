import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module-header',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './module-header.html',
  styleUrl: './module-header.css',
})
export class ModuleHeader {
  @Input() moduleTitle: string = '';

  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
