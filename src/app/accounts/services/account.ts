import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Account, AccountFormValues } from '../models/account';
import { ApiResponse, PaginatedResponse } from '../../core/models/global';
import { API_BASE_URL } from '../../core/constants/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = `${API_BASE_URL}/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(page = 1, perPage = 5): Observable<PaginatedResponse<Account>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);

    return this.http.get<PaginatedResponse<Account>>(this.apiUrl, { params });
  }

  getAccount(id: number): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(`${this.apiUrl}/${id}`);
  }

  createAccount(account: AccountFormValues): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(this.apiUrl, account);
  }

  createBulk(accounts: Account[]): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/bulk`, { accounts });
  }

  updateAccount(id: number, account: Partial<Account>): Observable<ApiResponse<Account>> {
    return this.http.put<ApiResponse<Account>>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
