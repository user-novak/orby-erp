import { Component, inject } from '@angular/core';
import { StorageForm } from '../storage-form/storage-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-storage-create',
  imports: [StorageForm, MatButtonModule, MatIconModule],
  templateUrl: './storage-create.html',
  styleUrl: './storage-create.css',
})
export class StorageCreate {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/storage']);
  }
}
