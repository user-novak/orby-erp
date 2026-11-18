import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Account, AccountFormValues } from '../models/account';
import { ApiResponse, PaginatedResponse } from '../../core/models/global';
import { API_BASE_URL } from '../../core/constants/global';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

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

  getAllAccounts(): Observable<Account[]> {
    const perPage = 50;

    return this.getAccounts(1, perPage).pipe(
      switchMap((firstPage) => {
        const remainingPages = Array.from(
          { length: Math.max(firstPage.meta.last_page - 1, 0) },
          (_, index) => index + 2,
        );

        if (remainingPages.length === 0) {
          return of(firstPage.data);
        }

        return forkJoin(
          remainingPages.map((page) => this.getAccounts(page, perPage)),
        ).pipe(
          map((responses) => [
            ...firstPage.data,
            ...responses.flatMap((response) => response.data),
          ]),
        );
      }),
    );
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
