import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NoData } from '../../core/components/no-data/no-data';
import { NotificationData, PaginatedResponse } from '../../core/models/global';
import { LoaderService, NotificationService } from '../../core/services';
import {
  CATEGORY_COLUMN_HEADERS,
  CATEGORY_STATUS_OPTIONS,
  CATEGORY_TYPE_OPTIONS,
} from '../constants/category';
import { Category, CategoryListResponse } from '../models/category';
import { CategoryService } from '../services/category';

@Component({
  selector: 'app-category-index',
  imports: [MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule, NoData],
  templateUrl: './category-index.html',
  styleUrl: './category-index.css',
})
export class CategoryIndex implements OnInit {
  readonly categoryColumnHeaders = CATEGORY_COLUMN_HEADERS;
  readonly dataSource = new MatTableDataSource<Category>([]);

  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  private protectedCategoryIds = new Set<number>();
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.listCategories();
  }

  goToCreate(): void {
    this.router.navigateByUrl('/categories/create');
  }

  goToEdit(categoryId: number): void {
    if (this.isProtected(categoryId)) {
      return;
    }

    this.router.navigate(['/categories/edit', categoryId]);
  }

  isProtected(categoryId: number): boolean {
    return this.protectedCategoryIds.has(categoryId);
  }

  getTypeLabel(value: string): string {
    return CATEGORY_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
  }

  getStatusLabel(value: string): string {
    return CATEGORY_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listCategories();
  }

  private listCategories(): void {
    this.loaderService.show();

    forkJoin({
      categories: this.categoryService.getCategories(this.pageIndex + 1, this.pageSize),
      protectedCategories: this.categoryService.getProtectedCategories(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ categories, protectedCategories }) => {
          this.setCategories(categories);
          this.setProtectedCategories(protectedCategories);
          this.loaderService.hide();
        },
        error: () => {
          this.loaderService.hide();
          this.showNotification(
            this.generateNotification('Error al cargar categorías', 'error', '#f44336'),
            3000,
          );
        },
      });
  }

  private setCategories(response: PaginatedResponse<Category>): void {
    this.dataSource.data = response.data;
    this.totalItems = response.meta.total;
  }

  private setProtectedCategories(response: CategoryListResponse): void {
    this.protectedCategoryIds = new Set(response.data.map((category) => category.id));
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
