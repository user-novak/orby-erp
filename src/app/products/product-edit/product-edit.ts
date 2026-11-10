import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse, NotificationData } from '../../core/models/global';
import { FORM_MODE } from '../../core/enums/global';
import { Product, ProductFormValues } from '../models/product';
import { NotificationService } from '../../core/services/notification/notification';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-product-edit',
  imports: [MatButtonModule, MatIconModule, ProductForm],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class ProductEdit implements OnInit {
  readonly formMode: FORM_MODE = 'edit';
  readonly product = signal<Product | null>(null);
  productId!: number;

  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    this.validateProductId();
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  editProduct(productFormValue: ProductFormValues) {
    this.productService
      .updateProduct(this.productId, productFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.goToProducts();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al actualizar producto', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private validateProductId(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.productId) {
      this.goToProducts();
      return;
    }

    this.loadProduct();
  }

  private loadProduct(): void {
    this.productService
      .getProduct(this.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<Product>) => {
          this.product.set(response.data);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar producto', 'error', '#f44336'),
            3000,
          );
          this.goToProducts();
        },
      });
  }

  private generateNotification(
    message: string,
    icon: string,
    backgroundColor: string,
  ): NotificationData {
    return { message, icon, backgroundColor };
  }

  private showNotification(notification: NotificationData, duration?: number) {
    this.notification.show(notification, duration);
  }
}
