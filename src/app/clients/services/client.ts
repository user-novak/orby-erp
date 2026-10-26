import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, ClientFormValues } from '../models/client';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../../core/models/global';
import { API_BASE_URL } from '../../core/constants/global';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly apiUrl = `${API_BASE_URL}/clients`;

  constructor(private http: HttpClient) {}

  getClients(page = 1, perPage = 5): Observable<PaginatedResponse<Client>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);

    return this.http.get<PaginatedResponse<Client>>(this.apiUrl, { params });
  }

  getClient(id: number): Observable<ApiResponse<Client>> {
    return this.http.get<ApiResponse<Client>>(`${this.apiUrl}/${id}`);
  }

  createClient(client: ClientFormValues): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>(this.apiUrl, client);
  }

  createBulk(clients: Client[]): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/bulk`, { clients });
  }

  updateClient(id: number, client: Partial<Client>): Observable<ApiResponse<Client>> {
    return this.http.put<ApiResponse<Client>>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
