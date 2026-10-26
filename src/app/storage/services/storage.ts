import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../../core/models/global';
import { API_BASE_URL } from '../../core/constants/global';
import { Product, ProductFormValues } from '../models/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly apiUrl = `${API_BASE_URL}/products`;

  constructor(private http: HttpClient) {}

  getProducts(page = 1, perPage = 5): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

  getStorage(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  createStorage(storage: ProductFormValues): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, storage);
  }

  createBulk(storages: Product[]): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/bulk`, { storages });
  }

  updateStorage(id: number, storage: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, storage);
  }

  deleteStorage(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
