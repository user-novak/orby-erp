import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NotificationData } from '../../core/models/global';
import { NotificationService } from '../../core/services';
import { CategoryForm } from '../category-form/category-form';
import { CategoryFormValues } from '../models/category';
import { CategoryService } from '../services/category';

@Component({
  selector: 'app-category-create',
  imports: [MatButtonModule, MatIconModule, CategoryForm],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css',
})
export class CategoryCreate {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  goCategories(): void {
    this.router.navigate(['/categories']);
  }

  createCategory(categoryFormValue: CategoryFormValues): void {
    const { name, type } = categoryFormValue;

    this.categoryService
      .createCategory({ name, type })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.goCategories();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al crear categoría', 'error', '#f44336'),
            3000,
          );
        },
      });
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

  private showNotification(notification: NotificationData, duration?: number): void {
    this.notification.show(notification, duration);
  }
}
