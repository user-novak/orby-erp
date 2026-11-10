import { Component, DestroyRef, inject } from '@angular/core';
import { ProductForm } from '../product-form/product-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification';
import { ProductService } from '../services/product';
import { NotificationData } from '../../core/models/global';
import { ProductFormValues } from '../models/product';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-create',
  imports: [ProductForm, MatButtonModule, MatIconModule],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate {
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  createProduct(productFormValue: ProductFormValues) {
    this.productService
      .createProduct(productFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.goToProducts();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al crear producto', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  private generateNotification(
    message: string,
    icon: string,
    backgroundColor: string,
  ): NotificationData {
    return {
      message,
      icon,
      backgroundColor,
    };
  }

  private showNotification(notification: NotificationData, duration?: number) {
    this.notification.show(notification, duration);
  }
}
