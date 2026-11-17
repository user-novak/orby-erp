import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/constants/global';
import { PaginatedResponse } from '../../core/models/global';
import {
  Category,
  CategoryCreateRequest,
  CategoryListResponse,
  CategoryResourceResponse,
  CategoryUpdateRequest,
} from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${API_BASE_URL}/categories`;

  constructor(private readonly http: HttpClient) {}

  getCategories(page = 1, perPage = 5): Observable<PaginatedResponse<Category>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);

    return this.http.get<PaginatedResponse<Category>>(this.apiUrl, { params });
  }

  getProtectedCategories(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(`${this.apiUrl}/protected`);
  }

  getCategory(id: number): Observable<CategoryResourceResponse> {
    return this.http.get<CategoryResourceResponse>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: CategoryCreateRequest): Observable<CategoryResourceResponse> {
    return this.http.post<CategoryResourceResponse>(this.apiUrl, category);
  }

  updateCategory(
    id: number,
    category: CategoryUpdateRequest,
  ): Observable<CategoryResourceResponse> {
    return this.http.put<CategoryResourceResponse>(`${this.apiUrl}/${id}`, category);
  }
}
