import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FORM_MODE } from '../../core/enums/global';
import { NotificationData } from '../../core/models/global';
import { NotificationService } from '../../core/services';
import { CategoryForm } from '../category-form/category-form';
import { Category, CategoryFormValues } from '../models/category';
import { CategoryService } from '../services/category';

@Component({
  selector: 'app-category-edit',
  imports: [MatButtonModule, MatIconModule, CategoryForm],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css',
})
export class CategoryEdit implements OnInit {
  readonly formMode: FORM_MODE = 'edit';
  readonly category = signal<Category | null>(null);

  categoryId!: number;

  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.validateCategoryId();
  }

  goCategories(): void {
    this.router.navigate(['/categories']);
  }

  editCategory(categoryFormValue: CategoryFormValues): void {
    this.categoryService
      .updateCategory(this.categoryId, categoryFormValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.goCategories();
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al editar categoría', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private loadCategory(): void {
    forkJoin({
      category: this.categoryService.getCategory(this.categoryId),
      protectedCategories: this.categoryService.getProtectedCategories(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ category, protectedCategories }) => {
          const isProtected = protectedCategories.data.some((item) => item.id === this.categoryId);

          if (isProtected) {
            this.showNotification(
              this.generateNotification(
                'Esta categoría predeterminada no se puede editar',
                'lock',
                '#f44336',
              ),
              3000,
            );
            this.goCategories();
            return;
          }

          this.category.set(category.data);
        },
        error: () => {
          this.showNotification(
            this.generateNotification('Error al cargar categoría', 'error', '#f44336'),
            3000,
          );
          this.goCategories();
        },
      });
  }

  private validateCategoryId(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.categoryId) {
      this.goCategories();
      return;
    }

    this.loadCategory();
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
