import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/global';
import { Storage } from '../models/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private apiUrl = 'https://orby-engine.fly.dev/api/storages';

  constructor(private http: HttpClient) {}

  getStorages(): Observable<ApiResponse<Storage[]>> {
    return this.http.get<ApiResponse<Storage[]>>(this.apiUrl);
  }

  getStorage(id: number): Observable<ApiResponse<Storage>> {
    return this.http.get<ApiResponse<Storage>>(`${this.apiUrl}/${id}`);
  }

  createStorage(storage: Storage): Observable<ApiResponse<Storage>> {
    return this.http.post<ApiResponse<Storage>>(this.apiUrl, storage);
  }

  createBulk(storages: Storage[]): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/bulk`, { storages });
  }

  updateStorage(id: number, storage: Partial<Storage>): Observable<ApiResponse<Storage>> {
    return this.http.put<ApiResponse<Storage>>(`${this.apiUrl}/${id}`, storage);
  }

  deleteStorage(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
